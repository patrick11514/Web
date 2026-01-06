import { languages, type ErrorPath } from '$/lib/lang';
import { articleSchema as _articleSchema } from '$/types/schemes';
import type { ActionsResponse, Response } from '$/types/types';
import { FILE_FOLDER } from '$env/static/private';
import { AnyFormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import { fail } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import Path from 'node:path';
import { v4 } from 'uuid';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { insertTranslations, parseFormData } from '../functions';
import { conn } from '../variables';

const articleSchema = _articleSchema('cs');

export default [
  loggedProcedure.POST.input(AnyFormDataInput).query(async ({ input: _input }) => {
    const parsed = parseFormData(_input, articleSchema);
    const input = parsed.cs;

    const trx = await conn.startTransaction().execute();

    try {
      const translations = await insertTranslations(trx, parsed, [
        'title',
        'description',
        'content_md'
      ]);

      const uuid = v4();

      await trx
        .insertInto('article')
        .values({
          id: uuid,
          title: translations.title,
          description: translations.description,
          content_md: translations.content_md
        })
        .execute();

      //equipment
      if (input.equipment.length > 0) {
        await trx
          .insertInto('article_equipment')
          .values(
            input.equipment.map((eq) => ({
              article_id: uuid,
              equipment_id: eq
            }))
          )
          .execute();
      }

      //images
      if (input.images.length === 0) {
        return fail(400, {
          status: false,
          message: 'article.noImages' satisfies ErrorPath
        } satisfies ActionsResponse);
      }

      const languagesKeys = Object.keys(languages);
      const imagesToInsert = [];

      for (let i = 0; i < input.images.length; i++) {
        const image = input.images[i];

        const transObject: Record<string, { alt_text: string }> = {};
        for (const lang of languagesKeys) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const langData = parsed[lang] as any;
          transObject[lang] = { alt_text: langData?.images?.[i]?.alt_text ?? '' };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transResult = await insertTranslations(trx, transObject as any, [
          'alt_text'
        ]);

        imagesToInsert.push({
          article_id: uuid,
          name: image.name,
          alt_text: transResult.alt_text
        });
      }

      await trx.insertInto('gallery_image').values(imagesToInsert).execute();

      //exposures
      if (input.exposures.length > 0) {
        await trx
          .insertInto('exposure')
          .values(
            input.exposures.map((exposure) => ({
              ...exposure,
              article_id: uuid
            }))
          )
          .execute();
      }

      await trx.commit().execute();
      return {
        status: true
      } satisfies Response;
    } catch (err) {
      console.error(err);
      await trx.rollback().execute();

      return fail(500, {
        status: false,
        message: 'internal' satisfies ErrorPath
      } satisfies ActionsResponse);
    }
  }),
  loggedProcedure.PUT.input(AnyFormDataInput).query(async ({ input: _input }) => {
    const parsed = parseFormData(_input, articleSchema);
    const input = parsed.cs;

    if (!input.id) {
      return fail(400, {
        status: false,
        message: 'article.notFound' satisfies ErrorPath
      } satisfies ActionsResponse);
    }

    const originalData = await conn
      .selectFrom('article')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();
    if (!originalData) {
      return fail(404, {
        status: false,
        message: 'article.notFound' satisfies ErrorPath
      } satisfies ActionsResponse);
    }

    const trx = await conn.startTransaction().execute();

    try {
      let someChanged = false;
      const languagesKeys = Object.keys(languages);

      // Update Translations (Title, Description, Content)
      const fields = ['title', 'description', 'content_md'] as const;
      for (const field of fields) {
        const uuid = originalData[field];
        for (const lang of languagesKeys) {
          const newText = parsed[lang]?.[field];
          if (newText) {
            await trx
              .updateTable('translations')
              .set({ text: newText })
              .where('key', '=', uuid)
              .where('lang', '=', lang)
              .execute();
            someChanged = true;
          }
        }
      }

      //equipment
      const originalEquipment = await conn
        .selectFrom('article_equipment')
        .select(['equipment_id'])
        .where('article_id', '=', input.id)
        .execute();
      const ids = originalEquipment.map((eq) => eq.equipment_id);
      const toAdd = input.equipment.filter((eq) => !ids.includes(eq));
      const toRemove = originalEquipment.filter(
        (eq) => !input.equipment.includes(eq.equipment_id)
      );

      if (toAdd.length > 0) {
        someChanged = true;
        await trx
          .insertInto('article_equipment')
          .values(
            toAdd.map((eq) => ({
              article_id: input.id!,
              equipment_id: eq
            }))
          )
          .execute();
      }

      if (toRemove.length > 0) {
        someChanged = true;
        await trx
          .deleteFrom('article_equipment')
          .where('article_id', '=', input.id!)
          .where(
            'equipment_id',
            'in',
            toRemove.map((eq) => eq.equipment_id)
          )
          .execute();
      }

      //images
      if (input.images.length === 0) {
        return fail(400, {
          status: false,
          message: 'article.noImages' satisfies ErrorPath
        } satisfies ActionsResponse);
      }

      const originalImages = await conn
        .selectFrom('gallery_image')
        .selectAll()
        .where('article_id', '=', input.id)
        .execute();

      const inputImageNames = input.images.map((img) => img.name);

      // Removed Images
      const imagesToRemove = originalImages.filter(
        (img) => !inputImageNames.includes(img.name)
      );
      if (imagesToRemove.length > 0) {
        someChanged = true;
        // Delete images
        await trx
          .deleteFrom('gallery_image')
          .where(
            'id',
            'in',
            imagesToRemove.map((img) => img.id)
          )
          .execute();

        // Cleanup translations
        await trx
          .deleteFrom('translations')
          .where(
            'key',
            'in',
            imagesToRemove.map((img) => img.alt_text)
          )
          .execute();
      }

      // Process Input Images
      for (let i = 0; i < input.images.length; i++) {
        const img = input.images[i];
        const existing = originalImages.find((orig) => orig.name === img.name);

        if (existing) {
          // Update Translations
          const uuid = existing.alt_text;
          for (const lang of languagesKeys) {
            const newText = parsed[lang]?.images?.[i]?.alt_text ?? '';

            const result = await trx
              .updateTable('translations')
              .set({ text: newText })
              .where('key', '=', uuid)
              .where('lang', '=', lang)
              .executeTakeFirst();

            if (Number(result.numUpdatedRows) === 0) {
              await trx
                .insertInto('translations')
                .values({ key: uuid, lang: lang, text: newText })
                .execute();
            }
          }
        } else {
          someChanged = true;
          // New Image -> Insert
          const transObject: Record<string, { alt_text: string }> = {};
          for (const lang of languagesKeys) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const langData = parsed[lang] as any;
            transObject[lang] = { alt_text: langData?.images?.[i]?.alt_text ?? '' };
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transResult = await insertTranslations(trx, transObject as any, [
            'alt_text'
          ]);

          await trx
            .insertInto('gallery_image')
            .values({
              article_id: input.id!,
              name: img.name,
              alt_text: transResult.alt_text
            })
            .execute();
        }
      }

      //exposures
      const originalExposures = await conn
        .selectFrom('exposure')
        .select(['id'])
        .where('article_id', '=', input.id)
        .execute();
      const exposureIds = originalExposures.map((exp) => exp.id);
      const toAddExposures = input.exposures.filter(
        (exp) => exp.id === undefined || !exposureIds.includes(exp.id)
      );
      const toRemoveExposures = originalExposures.filter(
        (exp) => !input.exposures.some((_exp) => _exp.id === exp.id)
      );

      if (toAddExposures.length > 0) {
        await trx
          .insertInto('exposure')
          .values(
            toAddExposures.map((exposure) => ({
              ...exposure,
              article_id: input.id!
            }))
          )
          .execute();
      }

      if (toRemoveExposures.length > 0) {
        await trx
          .deleteFrom('exposure')
          .where('article_id', '=', input.id!)
          .where(
            'id',
            'in',
            toRemoveExposures.map((exp) => exp.id)
          )
          .execute();
      }

      if (someChanged) {
        await trx
          .updateTable('article')
          .set({
            updated_at: new Date()
          })
          .where('id', '=', input.id!)
          .execute();
      }

      await trx.commit().execute();
      return {
        status: true
      } satisfies Response;
    } catch (err) {
      console.error(err);
      await trx.rollback().execute();

      return fail(500, {
        status: false,
        message: 'internal' satisfies ErrorPath
      } satisfies ActionsResponse);
    }
  }),
  loggedProcedure.DELETE.input(z.string()).query(async ({ input }) => {
    const trx = await conn.startTransaction().execute();
    try {
      //equipment
      await trx.deleteFrom('article_equipment').where('article_id', '=', input).execute();
      //exposures
      await trx.deleteFrom('exposure').where('article_id', '=', input).execute();
      //images
      const images = await conn
        .selectFrom('gallery_image')
        .select(['name'])
        .where('article_id', '=', input)
        .execute();
      await trx.deleteFrom('gallery_image').where('article_id', '=', input).execute();
      //remove images
      const imgPaths = images.map((img) => Path.join(FILE_FOLDER, img.name));
      await Promise.all(imgPaths.map(async (path) => fs.unlink(path).catch(() => {})));

      await trx.deleteFrom('article').where('id', '=', input).execute();

      await trx.commit().execute();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      console.error(err);

      await trx.rollback().execute();

      return {
        status: false,
        code: 500,
        message: 'internal' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }
  })
];
