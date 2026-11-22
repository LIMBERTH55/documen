import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import {
  INSTITUTION,
  TIPO_META,
  getModuleLabel,
  type DocumentRecord,
  type Gestion,
  type ModuleKey,
  type TipoCorrespondencia,
} from "../types";
import { formatGenerationDate, slugify } from "./format";

const COLORS = {
  blue: "0B3B8C",
  blueDark: "072A66",
  blueLight: "EAF1FF",
  text: "0F172A",
  muted: "64748B",
  border: "C9D6E8",
  rowAlt: "F6F9FE",
  white: "FFFFFF",
};

const FONT = "Calibri";

export interface WordExportOptions {
  gestion: Gestion;
  module: ModuleKey;
  tipo?: TipoCorrespondencia;
  records: DocumentRecord[];
  totalRecords: number;
  filtersApplied?: boolean;
}

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  left: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  right: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: COLORS.white },
};

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
  left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
  right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
};

function buildInstitutionalHeader(generationDate: string): Header {
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 14, type: WidthType.PERCENTAGE },
                shading: { fill: COLORS.blue, type: ShadingType.CLEAR, color: "auto" },
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 100, bottom: 100, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 0 },
                    children: [
                      new TextRun({
                        text: "SGD",
                        bold: true,
                        size: 30,
                        color: COLORS.white,
                        font: FONT,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [
                      new TextRun({
                        text: "ACADÉMICO",
                        bold: true,
                        size: 10,
                        color: "D6E4FF",
                        font: FONT,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 56, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 160, right: 120 },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    spacing: { after: 20 },
                    children: [
                      new TextRun({
                        text: INSTITUTION.name.toUpperCase(),
                        bold: true,
                        size: 28,
                        color: COLORS.blue,
                        font: FONT,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 10 },
                    children: [
                      new TextRun({
                        text: INSTITUTION.area,
                        size: 16,
                        color: COLORS.muted,
                        font: FONT,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 0 },
                    children: [
                      new TextRun({
                        text: INSTITUTION.office,
                        size: 15,
                        color: COLORS.muted,
                        font: FONT,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 120, right: 100 },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 40 },
                    children: [
                      new TextRun({
                        text: "FECHA DE GENERACIÓN",
                        bold: true,
                        size: 12,
                        color: COLORS.muted,
                        font: FONT,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 0 },
                    children: [
                      new TextRun({
                        text: generationDate,
                        bold: true,
                        size: 17,
                        color: COLORS.blueDark,
                        font: FONT,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 120, after: 180 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 12,
            color: COLORS.blue,
            space: 1,
          },
        },
        children: [],
      }),
    ],
  });
}

function buildFooter(generationDate: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 40 },
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: COLORS.border,
            space: 8,
          },
        },
        children: [
          new TextRun({
            text: `Documento generado el ${generationDate} · ${INSTITUTION.system}`,
            size: 14,
            color: COLORS.muted,
            font: FONT,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            children: ["Página ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES],
            bold: true,
            size: 16,
            color: COLORS.blue,
            font: FONT,
          }),
        ],
      }),
    ],
  });
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { fill: COLORS.blue, type: ShadingType.CLEAR, color: "auto" },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 18,
            color: COLORS.white,
            font: FONT,
          }),
        ],
      }),
    ],
  });
}

function bodyCell(
  text: string,
  width: number,
  alternate: boolean,
  options: { bold?: boolean; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {},
): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: alternate
      ? { fill: COLORS.rowAlt, type: ShadingType.CLEAR, color: "auto" }
      : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: options.align ?? AlignmentType.LEFT,
        spacing: { before: 0, after: 0, line: 240 },
        children: [
          new TextRun({
            text: text || "—",
            bold: options.bold ?? false,
            size: 17,
            color: options.color ?? COLORS.text,
            font: FONT,
          }),
        ],
      }),
    ],
  });
}

function buildRecordsTable(records: DocumentRecord[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell("Carrera", 30),
      headerCell("Nro. de Dictamen o Código", 24),
      headerCell("Descripción", 46),
    ],
  });

  const dataRows = records.map(
    (record, index) =>
      new TableRow({
        cantSplit: true,
        children: [
          bodyCell(record.carrera, 30, index % 2 === 1, { bold: true }),
          bodyCell(record.codigo, 24, index % 2 === 1, { color: COLORS.blue }),
          bodyCell(record.descripcion, 46, index % 2 === 1),
        ],
      }),
  );

  if (dataRows.length === 0) {
    dataRows.push(
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            columnSpan: 3,
            margins: { top: 160, bottom: 160, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "No hay registros para mostrar en esta selección.",
                    italics: true,
                    size: 17,
                    color: COLORS.muted,
                    font: FONT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: tableBorders,
    rows: [headerRow, ...dataRows],
  });
}

export function buildReportDocument(options: WordExportOptions): Document {
  const { gestion, module, tipo, records, totalRecords, filtersApplied = false } = options;
  const generationDate = formatGenerationDate(new Date());
  const moduleLabel = getModuleLabel(module, tipo);
  const tipoLabel =
    module === "correspondencia" && tipo
      ? TIPO_META[tipo].singular.toUpperCase()
      : moduleLabel.toUpperCase();

  const countLabel =
    records.length === 1 ? "registro incluido" : "registros incluidos";

  const children = [
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: `GESTIÓN: ${gestion}`,
          bold: true,
          size: 40,
          color: COLORS.blue,
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({
          text: `TIPO: ${tipoLabel}`,
          bold: true,
          size: 24,
          color: COLORS.text,
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 220 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 8,
          color: COLORS.border,
          space: 8,
        },
      },
      children: [],
    }),
    new Paragraph({
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({
          text: `${records.length} ${countLabel}`,
          bold: true,
          size: 18,
          color: COLORS.text,
          font: FONT,
        }),
        new TextRun({
          text: filtersApplied
            ? ` de ${totalRecords} registros disponibles (filtros aplicados).`
            : ` en la gestión ${gestion}.`,
          size: 18,
          color: COLORS.muted,
          font: FONT,
        }),
      ],
    }),
    buildRecordsTable(records),
    new Paragraph({
      spacing: { before: 220, after: 0 },
      children: [
        new TextRun({
          text: "Este reporte fue generado automáticamente por el Sistema de Gestión Documental Académica.",
          italics: true,
          size: 15,
          color: COLORS.muted,
          font: FONT,
        }),
      ],
    }),
  ];

  return new Document({
    creator: INSTITUTION.system,
    title: `Gestión ${gestion} · ${moduleLabel}`,
    subject: `Reporte de ${moduleLabel} de la gestión ${gestion}`,
    description: `Reporte institucional de ${moduleLabel} correspondiente a la gestión ${gestion}.`,
    keywords: "gestión documental, dictámenes, correspondencia, auxiliatura",
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: {
              top: 1134,
              right: 1020,
              bottom: 1134,
              left: 1020,
              header: 567,
              footer: 567,
            },
          },
        },
        headers: {
          default: buildInstitutionalHeader(generationDate),
        },
        footers: {
          default: buildFooter(generationDate),
        },
        children,
      },
    ],
  });
}

export async function exportRecordsToWord(options: WordExportOptions): Promise<void> {
  const document = buildReportDocument(options);
  const blob = await Packer.toBlob(document);
  const moduleLabel = getModuleLabel(options.module, options.tipo);
  const fileName = `SGD_${options.gestion}_${slugify(moduleLabel)}.docx`;
  saveAs(blob, fileName);
}
