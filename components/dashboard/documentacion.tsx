"use client";

import { useMemo, type ReactNode } from "react";
import { useDashboard } from "@/components/dashboard/provider";
import { CALCULATED_FIELDS, COLOR_SYSTEM } from "@/lib/dictionary";
import { formatARS, formatPct, formatPp } from "@/lib/format";
import { DEFAULT_FILTERS } from "@/lib/metrics";
import { RESERVAS } from "@/lib/reservas";
import { buildView } from "@/lib/view";

const SECTIONS = [
  { id: "objetivo", index: "01", title: "Objetivo del análisis" },
  { id: "fuente", index: "02", title: "Fuente de datos" },
  { id: "usuarios", index: "03", title: "Usuarios a los que va dirigido" },
  { id: "modelo", index: "04", title: "Modelo de datos y conexiones" },
  { id: "campos", index: "05", title: "Campos calculados creados" },
  { id: "parametros", index: "06", title: "Parámetros creados" },
  { id: "colores", index: "07", title: "Sistema de colores" },
  { id: "conclusiones", index: "08", title: "Conclusiones" },
  { id: "glosario", index: "09", title: "Glosario" },
];

export function Documentacion() {
  const { view } = useDashboard();
  const opening = useMemo(() => buildView(DEFAULT_FILTERS), []);
  const year2024 = useMemo(() => buildView({ ...DEFAULT_FILTERS, anio: "2024" }), []);
  const patagonia = useMemo(() => buildView({ ...DEFAULT_FILTERS, region: "Patagonia" }), []);
  const fixedAll = opening.mix.find((row) => row.region === "Patagonia");
  const fixedOther = patagonia.mix.find((row) => row.region === "Patagonia");
  const cities = [...opening.cities].filter((city) => city.estado === "Sobre umbral").sort((a, b) => b.cancelPct - a.cancelPct);
  const ushuaia = opening.cities.find((city) => city.id === "ushuaia");
  const hosts = [...opening.hosts].sort((a, b) => b.cancelPct - a.cancelPct);

  return (
    <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
      <nav aria-label="Secciones de la documentación" className="flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:self-start">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="shrink-0 rounded-full border border-line bg-ivory px-3 py-1.5 text-xs text-stone hover:text-ink lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0">
            <span className="num mr-1.5">{section.index}</span>
            {section.title}
          </a>
        ))}
      </nav>
      <article className="max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.16em] text-stone uppercase">Hoja 3 · Documentación</p>
        <h1 className="mt-2 font-heading text-4xl leading-tight text-ink">Cómo está armado este tablero, y qué se puede concluir.</h1>
        <p className="mt-4 text-sm leading-relaxed text-stone">
          Valentino Nicolas Vallone. Las hojas 1 y 2 se leen sin esta página. Esta hoja deja por escrito el objetivo, la fuente, el modelo, los cálculos y el sistema de color.
        </p>

        <Section id="objetivo" index="01" title="Objetivo del análisis">
          <p>
            La pregunta es comercial: en los alquileres temporarios de Argentina, ¿dónde se está yendo el ingreso y qué cancelaciones conviene frenar antes de la temporada de verano?
          </p>
          <p>
            El panorama responde el qué. El diagnóstico responde el porqué y cierra con tres decisiones. El corte con el que abre el tablero es el check-in de 2025, comparado de enero a noviembre contra 2024, con un umbral de cancelación del 13%.
          </p>
        </Section>

        <Section id="fuente" index="02" title="Fuente de datos">
          <p>
            Es el mismo dataset de la pre-entrega 1: reservas de alquiler temporario en 15 ciudades de Argentina. No es Supertienda ni una base de práctica de clase. Cada fila es una reserva, con lugar, anfitrión, canal, precio y estado.
          </p>
          <p>
            Los importes están en pesos, como vienen en la fuente. El check-in va de enero de 2023 al 17 de diciembre de 2025. Por eso la variación de 2025 usa enero–noviembre y deja diciembre visible en el eje doble, sin compararlo contra un diciembre completo.
          </p>
          <p>{RESERVAS.length.toLocaleString("es-AR")} reservas, 15 plazas, 20 anfitriones y 6 tipos de propiedad. Cuatro canales: app móvil, sitio web, agencia turística y reserva directa.</p>
        </Section>

        <Section id="usuarios" index="03" title="Usuarios a los que va dirigido">
          <p>
            Coordinación comercial de la red de alquileres, en una lectura semanal. Les sirve para ver qué plazas superan el umbral de cancelación, qué anfitrión revisar y dónde no conviene bajar el precio por noche.
          </p>
          <p>El segundo lector es quien cobra la seña: el tablero muestra que la reserva hecha con más de 30 días cancela más que la de la última semana.</p>
        </Section>

        <Section id="modelo" index="04" title="Modelo de datos y conexiones">
          <p>
            Trabajé con una sola tabla. Alcanza porque el grano ya es la reserva: ciudad, provincia, barrio, tipo, anfitrión, canal, fechas e importes viven en la misma fila. No hace falta un join para responder la pregunta, y sumar tablas solo para mostrar una relación no mejora el análisis.
          </p>
          <ModelCard title="reservas" detail="Una fila por reserva. Clave id_reserva. Trae check-in, ciudad, tipo, anfitrión, canal, noches, precio, ingresos, calificación y estado." />
          <p>
            La región del filtro es comercial, no un campo de la fuente. La armé con un CASE sobre la provincia: CABA es AMBA; Buenos Aires, Santa Fe y Córdoba son Centro; Mendoza es Cuyo; Salta, Jujuy y Tucumán son NOA; Misiones es NEA; y la Patagonia junta Tierra del Fuego, Santa Cruz, Chubut y Río Negro. Mar del Plata y La Plata quedan en Centro.
          </p>
        </Section>

        <Section id="campos" index="05" title="Campos calculados creados">
          <ul className="space-y-3">
            {CALCULATED_FIELDS.map((field) => (
              <li key={field.nombre} className="rounded-xl border border-line bg-ivory p-4">
                <p className="text-sm font-medium text-ink">{field.nombre}</p>
                <p className="mt-1 text-[11px] tracking-[0.12em] text-stone uppercase">{field.tipo}</p>
                <p className="num mt-2 text-sm text-ink">{field.formula}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">{field.uso}</p>
              </li>
            ))}
          </ul>
          <p>
            El año funciona como filtro de contexto: el FIXED se calcula adentro del año elegido. Región, canal, tipo y ciudad no entran en el mix de la red. El FIXED de la ciudad ignora el tipo y se ve en el tooltip del mapa cuando hay un tipo seleccionado.
            {fixedAll && fixedOther ? ` En este corte, Patagonia pesa ${formatPct(fixedAll.mixCadena)} en la red y el mismo ${formatPct(fixedOther.mixCadena)} aunque la selección esté filtrada a esa región.` : ""}
          </p>
        </Section>

        <Section id="parametros" index="06" title="Parámetros creados">
          <p>
            <strong>Medida principal.</strong> Ingresos, noches o reservas. Cambia la serie de barras del eje doble, el orden de los tipos y el tamaño de los símbolos del mapa. El número terracota del primer KPI sigue a esta medida.
          </p>
          <p>
            <strong>Umbral de cancelación.</strong> Un porcentaje entre 8% y 20%. Por defecto, 13%. Recalcula el campo Estado de cancelación. Se ve en el color del mapa, del treemap, del ranking, de la dispersión y de la nube, en la línea de referencia y en el KPI de plazas en alerta.
          </p>
          <p>
            <strong>Filtros visibles.</strong> Año de check-in, región comercial, canal y tipo de propiedad. Están en las hojas 1 y 2.
          </p>
          <p>
            <strong>Acción de filtro.</strong> Un clic en una plaza del mapa o del ranking filtra KPIs, eje doble, dona, tipos, treemap, dispersión, nube y mix. El mapa y el ranking quedan a la vista para elegir otra plaza. La selección viaja de una hoja a la otra. Se suelta con el mismo clic, con Quitar selección o con Esc.
          </p>
          <p>
            <strong>Acción de resaltado.</strong> Un clic en un anfitrión del treemap baja la opacidad del resto en el treemap y en la dispersión. El segundo clic lo suelta. La navegación entre las tres hojas está en el encabezado y en el pie, y no reemplaza esta acción.
          </p>
        </Section>

        <Section id="colores" index="07" title="Sistema de colores">
          <p>El mismo color tiene el mismo rol en las tres hojas. El fondo es papel. La tipografía es Fraunces en los títulos y Outfit en los números y el texto.</p>
          <ul className="space-y-2">
            {COLOR_SYSTEM.map((color) => (
              <li key={color.hex} className="flex gap-3 rounded-xl border border-line bg-ivory p-3">
                <span className="mt-0.5 size-8 shrink-0 rounded-md border border-line" style={{ background: color.hex }} />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {color.nombre} <span className="num font-normal text-stone">{color.hex}</span>
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-stone">{color.rol}</span>
                </span>
              </li>
            ))}
          </ul>
          <p>
            Los cuatro azules y el ocre de la dona identifican canales y no salen de ese gráfico. Las formas también tienen un solo sentido. En el mapa, triángulo es Patagonia, cuadrado es norte y círculo es el resto. En la dispersión, triángulo es casa o cabaña, círculo es departamento y cuadrado es estudio. El color de esos gráficos está reservado al estado de cancelación.
          </p>
        </Section>

        <Section id="conclusiones" index="08" title="Conclusiones">
          <p>Estas tres lecturas corresponden al corte con el que abre el tablero: check-in 2025, todas las regiones, todos los canales, umbral 13%.</p>
          <ol className="space-y-3">
            <li className="rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed">
              Entre enero y noviembre de 2025 los ingresos {opening.kpis.varIngresos != null && opening.kpis.varIngresos >= 0 ? "crecen" : "caen"} {formatPct(Math.abs(opening.kpis.varIngresos ?? 0))} contra el mismo tramo de 2024, y la cancelación queda en {formatPct(opening.kpis.cancelPct)}
              {opening.kpis.varCancelPp != null ? `, ${formatPp(opening.kpis.varCancelPp)} respecto de 2024` : ""}. El promedio de la red todavía pasa el umbral. {opening.alertCount} plazas no: {cities.map((city) => city.nombre).join(", ")}.
            </li>
            <li className="rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed">
              {ushuaia ? `${ushuaia.nombre} es la plaza cara que no se cae: precio por noche de ${formatARS(ushuaia.adr)} y cancelación de ${formatPct(ushuaia.cancelPct)}.` : ""} Conviene cuidar esa tarifa antes de empujar descuentos. El anfitrión más flojo del corte es {hosts[0]?.nombre}, con {formatPct(hosts[0]?.cancelPct ?? 0)}.
            </li>
            <li className="rounded-xl border border-line bg-ivory p-4 text-sm leading-relaxed">
              La reserva hecha con más de 30 días cancela {formatPct(opening.cancelLarga)}, contra {formatPct(opening.cancelCorta)} de la última semana. En 2024 la cancelación del año completo fue {formatPct(year2024.kpis.cancelPct)}. La seña en la reserva larga ataca la pérdida sin tocar el precio de las plazas que ya cobran bien.
            </li>
          </ol>
          <div className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-stone">
            <p className="font-medium text-ink">Lectura del corte actual</p>
            <p className="mt-1">{view.headline}</p>
            <p className="mt-1">{view.actions.map((action) => action.titulo).join(" · ")}.</p>
          </div>
        </Section>

        <Section id="glosario" index="09" title="Glosario">
          <Gloss term="ADR" text="Average daily rate. Acá es el promedio del precio por noche publicado en las reservas del corte." />
          <Gloss term="pp" text="Puntos porcentuales. Si la cancelación pasa de 11% a 12,4%, subió 1,4 pp. No es una suba del 1,4%." />
          <Gloss term="FIXED" text="Cálculo que ignora el filtro de una dimensión. Acá, el mix de la red ignora región, canal, tipo y ciudad." />
          <Gloss term="Check-in" text="Fecha en la que empieza la estadía. El año del tablero se lee por esa fecha, no por la fecha de reserva." />
        </Section>
      </article>
    </div>
  );
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-28 space-y-3 text-sm leading-relaxed text-ink">
      <h2 className="font-heading text-2xl text-ink">
        <span className="num mr-2 text-base text-stone">{index}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ModelCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-line bg-ivory p-4">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-stone">{detail}</p>
    </div>
  );
}

function Gloss({ term, text }: { term: string; text: string }) {
  return (
    <p>
      <strong>{term}.</strong> {text}
    </p>
  );
}
