import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoPeriod1713964800000 implements MigrationInterface {
    name = 'AddPhotoPeriod1713964800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ajouter la colonne period
        await queryRunner.query(`ALTER TABLE "photo" ADD "period" varchar`);
        
        // Mettre à jour les photos existantes
        await queryRunner.query(`UPDATE "photo" SET "period" = 'morning' WHERE "date" IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne period
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "period"`);
    }
} 