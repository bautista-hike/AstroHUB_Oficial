"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, BookOpen, X, Share2, PlayCircle } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Componente para manejar la imagen con fallback
function ImageContainer({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="my-4 ml-4 rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
      {!imageError && (
        <img 
          src={src}
          alt={alt}
          className="w-full h-auto"
          onError={(e) => {
            console.error(`Error cargando imagen: ${src}`)
            setImageError(true)
          }}
          onLoad={() => {
            console.log(`Imagen cargada correctamente: ${src}`)
            setImageLoaded(true)
          }}
        />
      )}
      {imageError && (
        <div className="p-4 text-sm text-gray-500 text-center bg-gray-50">
          <p className="mb-2">⚠️ La imagen no se pudo cargar.</p>
          <p className="text-xs">Asegúrate de que el archivo <code className="bg-gray-200 px-1 rounded">{src.replace('/', '')}</code> existe en la carpeta <code className="bg-gray-200 px-1 rounded">public</code> y tiene contenido.</p>
        </div>
      )}
    </div>
  )
}

export function TrainingsGlosarioSection() {
  const [activeTab, setActiveTab] = useState<"trainings" | "glosario">("trainings")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTraining, setSelectedTraining] = useState<number | null>(null)

  const trainings = [
    {
      title: "Cómo crear audiencias en Google",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento y Video",
      hasContent: true,
      partner: "Google Ads",
      videoUrl: "https://www.loom.com/share/4759ee14ca9045cca4a376b03dcc336f",
      content: `# **Guía paso a paso para crear una audiencia en Google Ads**

**1. Acceder al Audience Manager**

1. En Google Ads, andá a **Tools** (ícono de la llave inglesa).

2. Entrá en **Shared library → Audience manager**.

3. Seleccioná la pestaña **Custom segments**.

4. Hacé clic en el **"+"** para crear un nuevo segmento.

---

**2. Crear el Custom Segment**

1. En la ventana que aparece, asignale un **nombre** claro.

2. Elegí el **tipo de segmentación**:

    - **Intereses / sitios web visitados por el público**, o

    - **Términos de búsqueda** que usa tu audiencia.

3. Según lo que elijas, agregá:

    - Intereses

    - Sitios web

    - Términos de búsqueda

4. Tenés además la opción de permitir que Google use **términos, sitios o intereses similares** para expandir la audiencia.

---

**3. Crear la Audiencia final**

Una vez creado el custom segment:

1. Andá a la parte superior y entrá en la pestaña **Audiences**.

2. Hacé clic en el **"+"** para crear una nueva audiencia.

3. Poné el **nombre** de la audiencia.

4. En la sección de **Custom segment**, agregá el segmento que creaste en el paso anterior.

5. Si querés, también podés cargar **datos propios** (first-party data) como listas o bases propias.

6. Además podés agregar **más intereses, comportamientos o detalles demográficos** para afinar el público.

---

**4. Guardar**

Una vez terminada la configuración:

1. Hacé clic en **Guardar**.

2. La nueva audiencia queda lista para usarse en cualquier campaña de Google Ads.`,
    },
    {
      title: "Cómo crear audiencias en Meta",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento y Video",
      hasContent: true,
      partner: "Meta Ads",
      videoUrl: "https://www.loom.com/share/4ae02e1a2a374ba0aebc3d3f40400e6a",
      content: `# **Guía paso a paso para crear públicos en Meta Ads**

**1. Acceder a la sección de públicos**

1. En el Administrador de Anuncios, ingresá a la sección **Públicos**.

2. Hacé clic en **"Crear público"**.

3. Meta ofrece **tres tipos de públicos**:

    - **Personalizado**

    - **Similar (Lookalike)**

    - **Guardado**

A continuación, cómo configurar cada uno:

---

# **1) Público Personalizado**

El público personalizado se construye a partir de un **origen**, que puede ser propio (first-party data) o proveniente de Meta (actividades dentro de la plataforma o de la app).

**Cómo crearlo**

1. Seleccioná **Público personalizado** y hacé clic en **Siguiente**.

2. En la pestaña de configuración:

    - **Origen:** elegí la **cuenta** correspondiente.

    - **Evento:** seleccioná el **evento específico** que querés usar para la creación del público.

    - **Retención:** definí cuántos días hacia atrás querés que Meta considere a las personas que ejecutaron ese evento.

3. Poné un **nombre claro** al público.

4. Hacé clic en **Crear**.

5. Listo. El público ya queda disponible para usar en las campañas.

---

# **2) Público Similar (Lookalike)**

Este tipo de público se basa en un **público origen** ya existente. Meta busca personas en una región que sean **parecidas** a quienes componen ese público base.

**Cómo crearlo**

1. Seleccioná **Público similar**.

2. Elegí el **público origen** del cual Meta tomará el patrón. Suele ser un publico personalizado que creaste.

3. Seleccioná la **región** donde querés encontrar personas similares.

4. Definí el **porcentaje de similitud**:

    - Cuanto más bajo, más parecido al público base (pero más chico).

    - Cuanto más alto, más amplio pero menos preciso.

5. Hacé clic en **Crear público**.

6. Y listo: el Lookalike queda generado.

---

# **3) Público Guardado**

El público guardado se construye mediante **segmentación por intereses, demografía, comportamientos** y parámetros básicos como ubicación, edad o idioma.

**Cómo crearlo**

1. Seleccioná **Público guardado**.

2. Configurá:

    - **Ubicación:** país o región donde querés llegar.

    - **Edad mínima y máxima.**

    - **Exclusiones:** (generalmente se excluyen públicos usados en otras campañas para evitar solapamiento).

    - **Idioma:** seleccionar **All languages**.

3. Si querés, podés **incorporar un público personalizado** como base.

4. Definí:

    - Sexo

    - Detalles demográficos

    - Intereses

    - Comportamientos

5. Agregá todos los criterios necesarios según la estrategia.

6. Hacé clic en **Crear público**.

7. El público queda listo para usarse en tus conjuntos de anuncios.`,
    },
    {
      title: "Cómo subir videos en YouTube",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: true,
      partner: "Google Ads",
      content: `# **Guía paso a paso para subir videos a YouTube**

**1. Ingresar a YouTube**

1. Entrá en YouTube con la cuenta correspondiente.

---

**2. Subir el video**

1. En la esquina superior derecha, hacé clic en **"Create" → Subir video**.

2. Buscá el archivo y subilo.

3. Una vez que carga, vas a ver la pantalla de configuración del video.

---

**3. Configuración inicial del video**

1. **Título:** escribí el nombre que quieras asignarle.

2. **Thumbnail:** no agregar nada.

3. **Playlist:** dejar vacío, salvo que quieras crear una lista o agregarlo a una existente.

4. Seleccioná **"No es contenido para niños"**.

5. Hacé clic en **NEXT**.

---

**4. Video Elements**

1. No agregues nada aquí.

2. Volvé a hacer clic en **NEXT**.

---

**5. Checks**

1. Esperá a que YouTube revise automáticamente si hay problemas de copyright.

2. Si todo está OK, hacé clic en **NEXT** sin modificar nada.

---

**6. Visibility**

1. Publicá el video como **"Unlisted"** (oculto pero accesible por link).

2. No lo programes.

3. Hacé clic en **Save**.

---

**7. Obtener el link**

1. Una vez guardado, YouTube te va a mostrar el **link del video**.

2. Copialo y guardalo en el lugar donde gestiones los creativos.

    → Ese link es el que vas a usar para las **campañas de Google**.`,
    },
    {
      title: "Cómo implementar campañas de App en Google",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento y Video",
      hasContent: true,
      partner: "Google Ads",
      videoUrl: "https://www.loom.com/share/95874758e7cb4d3fa954e3b4ea37da85",
      videoUrls: ["https://www.loom.com/share/95874758e7cb4d3fa954e3b4ea37da85", "https://www.loom.com/share/18ec725b8ec34d9b927b44eecc2c7eba"],
      content: `# **Guía paso a paso para implementar campañas de Google App Campaigns**

**1. Crear una nueva campaña**

1. Entrá a la cuenta correspondiente.

2. Hacé clic en **"+" → New campaign**.

3. Seleccioná **"Crear campaña sin guía"**.

4. Elegí el **tipo de campaña**:

    → **App**

5. Seleccioná el **subtipo** según tu objetivo:

    - *Installs*

    - *Engagement*

    - *Pre-registration* (solo Android)

---

**2. Seleccionar la app**

> Importante: Las campañas de app se crean por separado para Android y iOS, ya que son ecosistemas distintos.

> Para un mismo producto (ej.: Global Card), siempre vas a hacer **dos campañas**, una por cada sistema operativo.

1. Elegí el sistema operativo: **Android** o **iOS**.

2. Usá el buscador y escribí **"AstroPay"** (o la app correspondiente).

3. Seleccioná la aplicación correcta.

---

**3. Nombrar la campaña**

1. Escribí el **nombre de la campaña**.

2. Click en **Continuar**.

3. En el pop-up, seleccioná **"Start new"**.

---

**4. Configuraciones de campaña**

**4.1 Ubicación**

1. En **Location**, elegí **"Otra ubicación"** → buscá la región deseada → **Add / Incluir**.

2. En opciones de presencia, seleccioná:

    → **"Personas en o regularmente en tus ubicaciones seleccionadas"**

3. La sección de exclusiones se deja con la opción predeterminada.

4. En **Idioma**, seleccioná:

    → **All languages**

5. Click en **Next**.

---

**4.2 Bidding**

1. En el objetivo de puja, elegí **"In-app action"**.

2. **Método de tracking:**

    - Para Android e IOS, siempre: **Install in-app (Firebase)**.

3. **Evento de optimización:**

    Seleccioná el evento principal según el objetivo de la campaña (ej.: purchase, registration, deposit, etc.)

4. **Presupuesto:**

    - Ingresá el monto acordado.

    - Recordá: **el presupuesto es *diario*, no total.**

5. Ingresá el **Target CPA** (idealmente el sugerido por Google o un poco más alto).

6. Click en **Next**.

---

**5. Crear los anuncios**

**5.1 Títulos y descripciones**

Copiá y pegá cada uno de forma individual.

Revisá que todo quede correctamente ingresado.

---

**5.2 Imágenes**

1. En la sección **Imágenes**, hacé clic en **"+" → Upload**.

2. Cargá todos los assets correspondientes.

3. Una vez cargados:

    - Verificá que cada imagen cumpla con los formatos requeridos por Google:

        - **1.91:1**

        - **1:1**

        - **4:5**

4. Para editar o recortar:

    - Abrí la imagen desde la sección inferior.

    - Hacé clic en el **lápiz**.

    - Seleccioná el formato que mejor se adapte.

    - Si la imagen **no puede adaptarse correctamente**, deseleccionala.

5. Guardá los cambios.

---

**5.3 Videos**

1. En la sección **Videos**, hacé clic en **"+"**.

2. En la parte superior del pop-up, elegí **"Search YouTube"**.

3. Pegá la **URL del video** que quieras agregar.

4. Seleccioná el video y repetí el proceso para todos los links.

5. Guardá.

---

**5.4 Otros assets**

- **HTML5:** se deja vacío.

- **Promotions:** también vacío.

- **Deeplinks:** solo agregar si existen y están aprobados para usar.

---

**6. Audiencias (opcional)**

- Si **no** vas a usar audiencias, dejá esta sección vacía.

- Si **sí** tenés audiencias definidas:

    1. Hacé clic en **"Agregar señal de audiencias"**.

    2. Buscá y seleccioná la audiencia correspondiente.

---

**7. Revisión final**

Antes de publicar:

1. Revisá todas las configuraciones.

2. Confirmá que Google no haya modificado nada automáticamente (suele pasar).

3. Si está todo correcto, finalizá la creación.`,
    },
    {
      title: "Cómo implementar campañas de Search en Google",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento y Video",
      hasContent: true,
      partner: "Google Ads",
      videoUrl: "https://www.loom.com/share/e797ef83da9649d49ae0d6e362caf08a",
      content: `# **Guía paso a paso para crear campañas de Search en Google Ads**

Para crear la campaña de SEARCH se hacen los mismos pasos para crear una campaña pero en tipo de campaña pones **"Search"**

Todos los pasos son iguales hasta que llegas a la parte de **"Ad Group"**

Al crear una campaña de Search, Google ofrece la opción de ingresar una URL final para que sugiera palabras clave automáticamente. **No usamos esa función**, porque ya contamos con nuestras keywords definidas en el template interno.

Recordá que existen **tres tipos de concordancias**:

- **Amplia:** sin comillas ni corchetes → *ejemplo: pago online*

- **Frase:** entre comillas → *"pago online"*

- **Exacta:** entre corchetes → *[pago online]*

---

**1. Cargar las Keywords**

1. En el campo **"Enter keywords"**, copiá y pegá directamente las keywords desde el template interno.

2. Asegurate de respetar las concordancias (amplia, frase y exacta) tal como están en el archivo.

---

**2. Crear el Anuncio**

Luego avanzás a la configuración del anuncio.

**1. URL final**

- Pegá la URL correspondiente de **AstroPay**.

**2. Ad Strength**

- Google te mostrará una barra de **"Ad strength"**.

- El objetivo es llegar a la máxima calificación posible (bueno / excelente), agregando variedad y relevancia en títulos y descripciones.

**3. Display Path**

- Se deja **en blanco**. No es necesario completarlo.

**4. Títulos y descripciones**

- Cargá **15 títulos** y **4 descripciones**.

- Podés copiarlos del banco de copies o escribirlos manteniendo coherencia con la keyword principal.

- Revisá que todo quede cargado correctamente.

---

**3. Finalizar**

1. Una vez que está todo completo, hacé clic en **"Next"**.

2. El anuncio queda creado y listo para revisión y publicación.`,
    },
    {
      title: "Cómo implementar campañas de App Promotion en Meta",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: true,
      partner: "Meta Ads",
      content: `# **Guía paso a paso para implementar campañas de App Promotion en Meta**

**1. Crear la campaña**

1. Ingresá a Meta Ads Manager.

2. Hacé clic en **"+ Crear" → Promoción de la app** y luego **Continuar**.

3. Colocá el **nombre correspondiente** de la campaña.

---

**2. Configuración de la campaña**

1. **Objetivo:** seleccioná **"Promoción de la app"** (o el objetivo específico requerido).

2. **Presupuesto:** configurarlo **a nivel campaña**.

    - El resto de las opciones se deja como está, a menos que haya una instrucción específica.

3. **Sistema operativo:**

    - Si la campaña es **Android**, **NO** activar "Campaña de iOS 14+".

    - Si la campaña es **iOS**, **SÍ** activar esa opción.

4. El resto de los ajustes generales se dejan con la configuración predeterminada.

---

**3. Configuración del Conjunto de Anuncios**

Nombrá el **ad set** correctamente.

**3.1 Selección de app y eventos**

1. Buscá la **app** correspondiente.

2. Elegí el **objetivo** y el **evento in-app** que querés optimizar.

**3.2 Ajustes del conjunto**

1. **Atribución:** dejar **Estándar**.

2. **Catálogo:** seleccionar **Ninguno**.

3. **Fechas:** programar inicio y fin según corresponda.

4. **Presupuesto del ad set:** solo modificar si necesitás que en un día específico suba o baje (si no, se deja sin programación).

5. **Público:** elegir la audiencia adecuada para la campaña.

6. **Ubicaciones:** generalmente se dejan las **predeterminadas de Meta**, salvo indicación contraria.

Una vez configurado, hacé clic en **Siguiente**.

---

**4. Configuración de los Anuncios**

**4.1 Datos del anuncio**

1. **Página:** seleccioná la página correcta.

2. **App:** asegurate de seleccionar la misma app configurada en el ad set.

**4.2 Tipo de anuncio**

1. En **Configuración del anuncio**, elegí:

    → **Crear un anuncio**

    → Formato: **Imagen única o Video único**

2. Activar **Anuncio multianunciante**.

**4.3 Deep Link**

1. Agregar el **deeplink** solo si existe y es necesario para el objetivo de la campaña.

**4.4 Creatividades**

1. Elegí si el anuncio será con **foto** o **video**, subí los creativos y seleccioná el correspondiente.

2. Ajustá cada pieza siguiendo los formatos compatibles de Meta:

    - **Cuadrado**

    - **Vertical**

    - **Horizontal**

    Igual que en Google, vas formato por formato y lo emparejás con el creativo correcto.

**4.5 Textos**

1. En la sección de **Textos**:

    - Primero cargás las **descripciones**.

    - Después los **títulos**.

    - Al final, agregá el botón **"Usar app"**.

**4.6 Mejoras de Meta**

1. En **Mejoras**, desactivá todas las optimizaciones automáticas.

    - Confirmá que aparezca **0/9** activas antes de avanzar.

**5. Duplicación de anuncios**

Si vas a usar más de un creativo:

1. Duplicá el anuncio haciendo clic en los **tres puntos** (a la derecha del nombre del anuncio).

2. Duplicá tantas veces como creativos tengas.

3. A cada copia:

    - Cambiale la **imagen/video**.

    - Cambiale el **nombre**.

**6. Publicación final**

1. Revisá cada ad set y cada anuncio para confirmar que:

    - El creativo es el correcto.

    - El nombre está actualizado.

    - Los textos coinciden.

    - Las mejoras están desactivadas.

2. Hacé clic en **Publicar**.

3. Listo.`,
    },
    {
      title: "Cómo implementar campañas de App en TikTok",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: true,
      partner: "TikTok Ads",
      content: `# **Guía paso a paso para crear campañas de App en TikTok Ads**

---

**1. Crear una nueva campaña**

1. Entrá en la cuenta correspondiente de TikTok Ads.

2. Hacé clic en **+ Create**.

3. Seleccioná **App Promotion**.

4. En la solapa **Create new**, configurás todo lo relacionado a la campaña.

**1.1 Elegir Promotion Type**

Seleccioná el tipo de promoción según tu objetivo:

- **App Install** → para generar instalaciones.

    - **Manual Campaign:** configuración manual de todas las opciones (recomendada).

    - **Smart+ Campaign:** TikTok elige automáticamente placement, audiencia y otras configuraciones en base a la data de la app.

- **App Retargeting** → para reimpactar usuarios que ya instalaron la app.

**1.2 iOS 14**

Activar siempre que la campaña sea de iOS.

**1.3 Settings**

- **Campaign name:** definir un nombre claro y representativo.

- **Split test:** prueba A/B que compara dos versiones de campaña (audiencia, creatividad, puja u objetivo).

    Se usa cuando se quiere validar una hipótesis puntual antes de escalar presupuesto.

- **Budget:**

    - **Campaign Budget Optimization (CBO):** TikTok distribuye el presupuesto entre ad groups según rendimiento (ideal para maximizar resultados).

    - **Set Campaign Budget:** fijás un budget total y controlás el gasto por ad group de forma manual (ideal para tests o control granular).

**2. Configuración del Ad Group**

**2.1 Ad Group Name**

Elegir un nombre representativo al conjunto de anuncios.

**2.2 App**

Seleccionar la app correspondiente según el sistema operativo.

*Recordatorio: siempre se crea una campaña para Android y otra para iOS.*

**3. Placements**

Define dónde se mostrarán los anuncios.

- **Automatic placement:** recomendado; TikTok optimiza las ubicaciones para maximizar rendimiento en TikTok y Pangle.

- **User comments:** habilitar para aumentar interacción (se puede moderar desde el panel).

- **Allow video download / sharing:** habilitar según estrategia.

- **Pangle block list:** permite bloquear sitios externos si se busca mayor brand safety (reduce alcance).

---

**4. Targeting**

Define a qué audiencia se le mostrará el anuncio.

- Configuración de **ubicación**, **edad**, **género** e **intereses/comportamientos**.

- Si existe una audiencia previamente guardada (ej.: *LOCAL CARD ARG*), se puede seleccionar desde **Use saved audience**.

- TikTok recomienda **broad targeting** para que el algoritmo encuentre a los usuarios con mayor probabilidad de convertir.

---

**5. Budget and Schedule**

- Se selecciona el **budget a nivel ad group**, normalmente diario.

- **Schedule:** elegir fecha y hora de inicio.

    Generalmente se usa la fecha actual y se deja la campaña corriendo sin end date.

- **Dayparting:** se deja en *All day* para no limitar el aprendizaje.

---

**6. Bidding and Optimization**

- **Optimization goal:** elegir el objetivo principal de entrega.

    - **Install:** opción más común para campañas de adquisición.

    - **In-app event:** para optimizar a eventos dentro de la app (requiere volumen).

    - **Value:** para optimizar por usuarios de mayor valor (requiere aún más volumen).

- **Target CPA (opcional):** se deja vacío para evitar limitar el aprendizaje.

- **Attribution settings:** seleccionar ventana de atribución (recomendado: 7-day click).

**7. Configuración del Ad**

**7.1 Smart Creative**

"Use Smart Creative to create ads" permite que TikTok genere variaciones automáticas combinando assets.

Para AstroPay **no se utiliza**, ya que se controla manualmente la creatividad.

**7.2 Ad Name**

Asignar un nombre representativo al anuncio.

**7.3 Ad Details**

Subir y configurar la pieza creativa final.

- **Video:** se selecciona el video desde la biblioteca.

- **Identity:** se elige la cuenta oficial de AstroPay desde la cual saldrá el anuncio.

- **Show through ads only:** se activa para que el contenido solo se muestre como anuncio, sin publicarse en el perfil.

- **Automate Creative:** se deja apagado para mantener control total de la creatividad.

- **Text:** se escribe el texto breve que aparece sobre el video (mensaje guía).

- **Call to Action:** se selecciona el botón, por ejemplo "Go to Google Play" o "Get AstroPay – Billetera Virtual".

- **Selling Points:** se ingresan beneficios clave de AstroPay, como "No hidden fees" o "Instant transfers", para generar variaciones si se requiere.

- **Advanced settings:** configuraciones adicionales que generalmente se dejan por defecto.

---

**8. Publicar**

Revisar toda la configuración y hacer clic en **Publish** para activar la campaña`,
    },
    {
      title: "Cómo implementar campañas de Apple",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: false,
      partner: "Apple Search Ads",
    },
    {
      title: "Cómo implementar campañas de Video Views en X",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: true,
      partner: "X Ads",
      content: `# Guía paso a paso para crear una campaña de **Video Views**

---

**1. Crear una nueva campaña**

1. Entrar en la cuenta correspondiente.

2. Hacer clic en **Create campaign**.

3. Seleccionar el objetivo **Video views**.

---

**2. Configuración de la campaña (Campaign details)**

- **Campaign name:** elegir un nombre claro y representativo.

- **Funding source:** seleccionar **"AR00373089 X | AstroPay Global | Branding OK"**.

- **Campaign budget optimization:**

    CBO permite que X distribuya automáticamente el presupuesto entre los ad groups según rendimiento.

    - Si está **activado**, se fija un **Daily campaign budget** o un **Total campaign budget**, y el algoritmo optimiza dónde invertir.

    - Si está **apagado**, el presupuesto se controla manualmente a nivel ad group.

---

3. Configuración del ad group

- **Ad group name:** se ingresa un nombre que identifique claramente la audiencia o estrategia (ej.: \`Travelers_BR_VideoViews\`); esto facilita comparar resultados entre segmentos.

- **Budget and schedule:** se define fecha y hora de inicio; normalmente se deja en **Run indefinitely** para no cortar el aprendizaje del algoritmo y manejar pausas/ajustes desde la vista de campañas.

- **Delivery**

    - **Goal:** objetivo de optimización; para este caso se usa **"15s video views (recommended)"** para maximizar views completas.

    - **Bid strategy:**

        - **Autobid:** recomendado como default; el sistema ajusta automáticamente la puja para conseguir el mayor volumen de resultados al menor costo.

        - **Maximum bid:** solo se usa si hay un tope de CPM/CPV muy definido que no se puede superar.

    - **Pay by:** modelo de pago, usualmente **Impressions (CPM)** en campañas de video.

    - **Frequency cap:** controla cuántas veces un usuario ve el anuncio en un período; por ejemplo, **15 impresiones cada 30 días** para evitar saturación.

    - **App conversions (optional):** se usa solo si se conecta un MMP y se quiere medir instalaciones/eventos; para campañas puras de video views no es imprescindible.

    - **Measurement options:** ajustes de medición (atribución, tags adicionales); se dejan por defecto salvo necesidad específica de tracking.

- **Placements:** define dónde se mostrará el anuncio (Home timelines, Profiles, Search results y Media Viewer).

    Lo recomendado es dejar **todos activados** para maximizar alcance y permitir que el algoritmo decida en qué placement obtiene mejores resultados.

- **Demographics:** define género, edad, idioma y país.

    - Se deja **Gender = Any**, **Age = All** y **Language vacío** para no restringir el algoritmo.

    - Se configura solo **Location**, seleccionando el país objetivo (por ejemplo, **Brazil**).

- **Devices:** indica en qué dispositivos aparece el anuncio (iOS, Android, Other mobile y Desktop).

    - Se deja **todo habilitado** para no perder inventario.

    - Los campos **Device model** y **Carrier** se dejan vacíos, salvo que se defina un caso de uso muy específico.

- **Audiences:** permite trabajar con audiencias propias.

    - Se pueden incluir o excluir **custom audiences** (listas, visitantes del sitio, usuarios que interactuaron con AstroPay).

    - Se puede activar **look-alikes** para ampliar a usuarios similares; se usa cuando hay una base sólida y queremos escalar manteniendo perfil de usuario.

- **Targeting features:** agrega señales adicionales de segmentación.

    - Incluye **keywords**, **follower look-alikes**, **interests**, **movies & TV shows** y **conversation topics**.

    - Ayuda a afinar la audiencia (por ejemplo, viajar, aerolíneas, hoteles, turismo en Caribe, etc.).

    - Lo recomendado es no sobrecargar la segmentación para conservar buen alcance; generalmente el equipo de X nos provee la lista de keywords / intereses por producto / audiencia y se replica.

---

4. Configuración de Ad

- **Ad name:** nombre interno del anuncio, por ejemplo **GLOBAL-CARD_3**, para identificar la pieza dentro del ad group.

- **Destination:** se selecciona **App**, ya que el objetivo final es llevar al usuario a instalar AstroPay.

- **Creative type:** se elige **Call to action**, que habilita el botón clickeable (Install).

- **Identity:** se selecciona la cuenta oficial **AstroPay (@AstroPay_OK)** desde la cual se mostrará el anuncio.

- **Primary text:** texto principal que aparece arriba del video; debe reforzar el beneficio principal y estar alineado al mercado.

    - Ejemplos usados en Brasil:

        - "Controle seu dinheiro do seu jeito."

        - "Com AstroPay, você decide onde e quando."

- **Media type:** se usa **Single media** con 1 video, por ejemplo: **PT_1x1_10s_AD_Global Card Request.mp4**.

- **Call to action:**

    - Se selecciona **Install**, de forma que el usuario va directo a la tienda de aplicaciones.

    - Es el CTA recomendado para campañas de adquisición de app.

- **Primary App Store:** indica el país de la tienda principal donde se medirá la instalación (por ejemplo, **BR** para Brasil).

- **Platform:** define en qué sistemas operativos se muestra el anuncio y qué app corresponde a cada uno.

    - **iOS:** activado, vinculado a **AstroPay – Global Wallet** (versión iPhone).

    - **Android:** activado, vinculado a **AstroPay (com.astropaycard.android)**.

- **Deeplink:** campo opcional para enviar al usuario a una pantalla específica dentro de la app después de la instalación; en las campañas actuales se deja vacío.

- **Promoted only:** al activarse, el contenido se usa solo como anuncio y no aparece en el feed orgánico de @AstroPay_OK; se recomienda activarlo para piezas pensadas exclusivamente para performance.

Configuracion de Ad:

- **Ad name:** nombre interno del anuncio, por ejemplo **GLOBAL-CARD_3** para identificar la pieza.

- **Destination:** se selecciona **App**, ya que el objetivo es dirigir al usuario a instalar AstroPay.

- **Creative type:** se usa **Call to action**, que habilita el botón de instalación.

- **Identity:** el anuncio se publica desde la cuenta oficial **AstroPay (@AstroPay_OK)**.

- **Primary text:** texto principal que aparece arriba del video. Ejemplos usados en Brasil: "Controle seu dinheiro do seu jeito." "Com AstroPay, você decide onde e quando."

- **Media type: Single media** con 1 video

- Call to action: Esta sección define el botón final que verá el usuario. Al elegir **Install**, el anuncio dirige directamente a la tienda de aplicaciones para descargar AstroPay. Es el CTA recomendado en campañas de adquisición.

- Primary App Store: Indica en qué país está configurada la tienda principal desde la cual se medirá la instalación.

- Platform: Permite seleccionar en qué plataformas debe estar disponible el anuncio (iOS y/o Android). Sirve para definir qué versión de la app se va a promocionar en cada sistema operativo.

    - **iOS:** está activado y vinculado a la app **AstroPay – Global Wallet** (versión iPhone).

    - **Android:** también activado, vinculado a **AstroPay (com.astropaycard.android)**.

- Deeplink: Permite enviar al usuario a una pantalla específica dentro de la app una vez instalada.

- Promoted: Al activarse, el contenido se usa solo como anuncio y no aparece en el perfil orgánico de AstroPay. Esto sirve cuando la pieza está creada únicamente para performance.

**5. Review and launch campaign**`,
    },
    {
      title: "Cómo implementar campañas de LinkedIn",
      date: "2025",
      duration: "Documento",
      link: "#",
      type: "Documento",
      hasContent: false,
      partner: "LinkedIn Ads",
    },
  ]

  // Agrupar trainings por partner
  const trainingsByPartner = trainings.reduce((acc, training) => {
    const partner = training.partner || "Otros"
    if (!acc[partner]) {
      acc[partner] = []
    }
    acc[partner].push(training)
    return acc
  }, {} as Record<string, Array<typeof trainings[number]>>)

  // Ordenar partners según el orden deseado
  const partnerOrder = ["Google Ads", "Meta Ads", "Apple Search Ads", "X Ads", "TikTok Ads", "LinkedIn Ads"]
  const sortedPartners = Object.keys(trainingsByPartner).sort((a, b) => {
    const indexA = partnerOrder.indexOf(a)
    const indexB = partnerOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // Debug en producción
  if (typeof window !== 'undefined') {
    console.log('Trainings agrupados:', trainingsByPartner)
    console.log('Partners ordenados:', sortedPartners)
    console.log('Total trainings:', trainings.length)
  }

  const glosario = [
    { term: "CTR", definition: "Click-Through Rate - Porcentaje de clics sobre impresiones" },
    { term: "CPC", definition: "Cost Per Click - Costo promedio por cada clic en el anuncio" },
    { term: "CPA", definition: "Cost Per Acquisition - Costo promedio por cada conversión" },
    { term: "ROAS", definition: "Return On Ad Spend - Retorno de inversión publicitaria" },
    { term: "CPM", definition: "Cost Per Mille - Costo por cada mil impresiones" },
    { term: "CVR", definition: "Conversion Rate - Porcentaje de conversiones sobre clics" },
    { term: "Impresiones", definition: "Número de veces que se muestra un anuncio" },
    { term: "Alcance", definition: "Número de personas únicas que vieron el anuncio" },
    { term: "Frecuencia", definition: "Promedio de veces que una persona ve el anuncio" },
    { term: "Engagement", definition: "Interacciones totales con el contenido (likes, shares, comments)" },
  ]

  const filteredGlosario = glosario.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Trainings & Glosario</h1>
          <p className="text-gray-600">Materiales de capacitación y definiciones de métricas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("trainings")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "trainings" ? "bg-[#00DBBF] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Trainings
          </button>
          <button
            onClick={() => setActiveTab("glosario")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "glosario" ? "bg-[#00DBBF] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Glosario
          </button>
        </div>

        {activeTab === "trainings" ? (
          <div className="space-y-4">
            {sortedPartners.length > 0 ? (
              <Accordion type="multiple" defaultValue={sortedPartners} className="w-full">
                {sortedPartners.map((partner) => {
                  const partnerTrainings = trainingsByPartner[partner]
                  if (!partnerTrainings || partnerTrainings.length === 0) return null
                  
                  return (
                    <AccordionItem key={partner} value={partner} className="border border-gray-200 rounded-xl mb-4 px-6 bg-white">
                      <AccordionTrigger className="text-xl font-bold text-[#053634] hover:no-underline py-6">
                        <div className="flex items-center gap-3">
                          <span>{partner}</span>
                          <Badge className="bg-[#00DBBF]/10 text-[#00DBBF] border-[#00DBBF]">
                            {partnerTrainings.length} {partnerTrainings.length === 1 ? 'training' : 'trainings'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                          {partnerTrainings.map((training, idx) => {
                            const originalIndex = trainings.indexOf(training)
                            return (
                              <motion.div
                                key={originalIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <Card 
                                  className="p-6 rounded-2xl bg-white hover:shadow-lg transition-all group cursor-pointer"
                                  onClick={() => {
                                    if (training.hasContent && training.content) {
                                      setSelectedTraining(originalIndex)
                                    } else if (training.link !== "#") {
                                      window.open(training.link, "_blank")
                                    }
                                  }}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#00DBBF]/10 rounded-xl group-hover:bg-[#00DBBF] transition-colors relative">
                                      <FileText className="w-8 h-8 text-[#00DBBF] group-hover:text-white transition-colors" />
                                      {training.videoUrl && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                          <PlayCircle className="w-3 h-3 text-white fill-white" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-lg font-bold text-[#053634] mb-2 group-hover:text-[#00DBBF] transition-colors">
                                        {training.title}
                                      </h3>
                                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 flex-wrap">
                                        <span>{training.date}</span>
                                        {training.type?.includes("Documento") && (
                                          <Badge className="bg-[#053634]/10 text-[#053634] text-xs">Documento</Badge>
                                        )}
                                        {training.type?.includes("Video") && training.videoUrl && (
                                          <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">Video</Badge>
                                        )}
                                      </div>
                                      {!training.hasContent && (
                                        <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">Sin contenido</Badge>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainings.map((training, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-6 rounded-2xl bg-white hover:shadow-lg transition-all group cursor-pointer"
                      onClick={() => {
                        if (training.hasContent && training.content) {
                          setSelectedTraining(index)
                        } else if (training.link !== "#") {
                          window.open(training.link, "_blank")
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#00DBBF]/10 rounded-xl group-hover:bg-[#00DBBF] transition-colors relative">
                          <FileText className="w-8 h-8 text-[#00DBBF] group-hover:text-white transition-colors" />
                          {training.videoUrl && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <PlayCircle className="w-3 h-3 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#053634] mb-2 group-hover:text-[#00DBBF] transition-colors">
                            {training.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 flex-wrap">
                            <span>{training.date}</span>
                            {training.type?.includes("Documento") && (
                              <Badge className="bg-[#053634]/10 text-[#053634] text-xs">Documento</Badge>
                            )}
                            {training.type?.includes("Video") && training.videoUrl && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">Video</Badge>
                            )}
                          </div>
                          {!training.hasContent && (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">Sin contenido</Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-4 rounded-2xl bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar término o definición..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlosario.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl bg-white hover:shadow-lg transition-all hover:border-[#00DBBF]/30">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DBBF]/10 rounded-lg">
                        <BookOpen className="w-5 h-5 text-[#00DBBF]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#053634] mb-1">{item.term}</h4>
                        <p className="text-sm text-gray-600">{item.definition}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Modal para mostrar contenido del training */}
        <Dialog open={selectedTraining !== null} onOpenChange={(open) => !open && setSelectedTraining(null)}>
          <DialogContent 
            className="w-full max-h-[98vh] overflow-hidden flex flex-col p-0"
            style={{ maxWidth: '65vw', width: '65vw' }}
          >
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {/* Logo dinámico según el training */}
                  {selectedTraining !== null && (() => {
                    const training = trainings[selectedTraining]
                    const isGoogle = training?.title?.includes('Google') && !training?.title?.includes('YouTube')
                    const isMeta = training?.title?.includes('Meta')
                    const isYouTube = training?.title?.includes('YouTube')
                    const isTikTok = training?.title?.includes('TikTok')
                    const isX = training?.title?.includes('Video Views en X') || training?.title?.includes('X')
                    
                    return (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isGoogle && (
                          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        )}
                        {isYouTube && (
                          <>
                            <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
                            </svg>
                          </>
                        )}
                        {isMeta && (
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #0081FB 0%, #0064E3 100%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.878V14.89H8.398V12H10.438V9.797C10.438 7.291 11.931 5.313 14.215 5.313C15.309 5.313 16.453 5.531 16.453 5.531V7.875H15.192C13.95 7.875 13.563 8.6 13.563 9.344V12H16.336L15.893 14.89H13.563V21.878C18.344 21.128 22 16.991 22 12C22 6.477 17.523 2 12 2Z" fill="white"/>
                            </svg>
                          </div>
                        )}
                        {isTikTok && (
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#25F4EE"/>
                              <path d="M16.61 2H19.4a.4.4 0 0 1 .4.4v2.79a.4.4 0 0 1-.4.4h-2.79a.4.4 0 0 1-.4-.4V2.4a.4.4 0 0 1 .4-.4z" fill="#FE2C55"/>
                            </svg>
                          </div>
                        )}
                        {isX && (
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
                          </svg>
                        )}
                      </div>
                    )
                  })()}
                  <DialogTitle className="text-2xl font-bold text-[#053634] flex-1">
                    {selectedTraining !== null && trainings[selectedTraining]?.title}
                  </DialogTitle>
                </div>
                {/* Botón de compartir */}
                {selectedTraining !== null && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const training = trainings[selectedTraining]
                      const shareData = {
                        title: training.title,
                        text: `Mira este training: ${training.title}`,
                        url: window.location.href,
                      }
                      if (navigator.share) {
                        navigator.share(shareData)
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        alert("Link copiado al portapapeles")
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </Button>
                )}
              </div>
            </DialogHeader>
            {selectedTraining !== null && (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Contenido del documento */}
                {trainings[selectedTraining]?.content && (() => {
                  const content = trainings[selectedTraining].content || ''
                  const lines = content.split('\n')
                  
                  return (
                    <div className="text-[#053634] prose prose-sm max-w-none">
                      {lines.map((line, idx) => {
                        const trimmedLine = line.trim()
                        
                        if (trimmedLine.startsWith('# **')) {
                          const text = trimmedLine.replace(/^# \*\*|\*\*$/g, '')
                          return <h1 key={idx} className="text-2xl font-bold mb-2 mt-4 text-[#053634]">{text}</h1>
                        }
                        // Detectar subtítulos que empiezan con ** (sin ##) - formato: **1. Título**
                        if (trimmedLine.match(/^\*\*\d+\./)) {
                          const text = trimmedLine.replace(/^\*\*|\*\*$/g, '')
                          return <h2 key={idx} className="text-xl font-bold mb-2 mt-3 text-[#053634]">{text}</h2>
                        }
                        // Detectar subtítulos con ### que también deben ser eliminados
                        if (trimmedLine.startsWith('### **')) {
                          const text = trimmedLine.replace(/^### \*\*|\*\*$/g, '')
                          return <h3 key={idx} className="text-lg font-bold mb-2 mt-2 text-[#053634]">{text}</h3>
                        }
                        // Mantener compatibilidad con formato antiguo ## ** por si acaso
                        if (trimmedLine.startsWith('## **')) {
                          const text = trimmedLine.replace(/^## \*\*|\*\*$/g, '')
                          return <h2 key={idx} className="text-xl font-bold mb-2 mt-3 text-[#053634]">{text}</h2>
                        }
                        if (trimmedLine.startsWith('---')) {
                          return <hr key={idx} className="my-3 border-gray-300" />
                        }
                        if (trimmedLine.match(/^\d+\./)) {
                          const parts = trimmedLine.split(/\*\*(.*?)\*\*/g)
                          // Detectar el punto 1 de "Crear la Audiencia final" que menciona "pestaña Audiences"
                          const isAudiencesPoint = trimmedLine.includes('pestaña') && trimmedLine.includes('Audiences') && trimmedLine.startsWith('1.')
                          // Detectar punto 3 del paso 2 de YouTube que menciona "pantalla de configuración"
                          const isYouTubeConfigPoint = trimmedLine.includes('pantalla de configuración') && trimmedLine.startsWith('3.')
                          // Detectar punto 5 del paso 5.2 de App Campaigns que dice "Guardá los cambios"
                          const isAppCampaignImagesPoint = trimmedLine.includes('Guardá los cambios') && trimmedLine.startsWith('5.')
                          return (
                            <div key={idx}>
                              <p className="ml-4 mb-1 text-base leading-relaxed">
                                {parts.map((part, i) => 
                                  i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                                )}
                              </p>
                              {/* Mostrar imagen después del punto 1 de Audiencias */}
                              {isAudiencesPoint && (
                                <ImageContainer src="/google-ads-audience-manager.png" alt="Google Ads Audience Manager - Pestaña Audiences" />
                              )}
                              {/* Mostrar imagen después del punto 3 del paso 2 de YouTube */}
                              {isYouTubeConfigPoint && (
                                <ImageContainer src="/youtube-config-screen.png" alt="YouTube - Pantalla de configuración del video" />
                              )}
                              {/* Mostrar imágenes después del punto 5 del paso 5.2 de App Campaigns */}
                              {isAppCampaignImagesPoint && (
                                <>
                                  <ImageContainer src="/google-app-campaign-images-1.png" alt="Google App Campaign - Imágenes 1" />
                                  <ImageContainer src="/google-app-campaign-images-2.png" alt="Google App Campaign - Imágenes 2" />
                                </>
                              )}
                            </div>
                          )
                        }
                        // Detectar bullets con "-"
                        if (trimmedLine.startsWith('- ')) {
                          const bulletText = trimmedLine.replace(/^-\s+/, '').replace(/\*\*/g, '')
                          const parts = trimmedLine.replace(/^-\s+/, '').split(/\*\*(.*?)\*\*/g)
                          // Detectar bullet del paso 4.6 de Meta App Promotion que menciona "0/9 activas"
                          const isMetaMejorasBullet = bulletText.includes('0/9') && bulletText.includes('activas')
                          // Detectar bullet del paso 5 de Meta App Promotion que menciona "Cambiale el nombre"
                          const isMetaDuplicacionBullet = bulletText.includes('Cambiale el') && bulletText.includes('nombre')
                          // Detectar bullet de TikTok que menciona "Pangle block list"
                          const isTikTokPlacementsBullet = bulletText.toLowerCase().includes('pangle block list')
                          // Detectar bullet de TikTok que menciona "broad targeting"
                          const isTikTokTargetingBullet = bulletText.toLowerCase().includes('broad targeting')
                          // Detectar bullet de TikTok que menciona "Attribution settings"
                          const isTikTokBiddingBullet = bulletText.toLowerCase().includes('attribution settings')
                          // Detectar bullet de X que menciona "Funding source"
                          const isXFundingBullet = bulletText.toLowerCase().includes('funding source')
                          
                          return (
                            <div key={idx}>
                              <div className="flex items-start mb-1 ml-4">
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#00DBBF] mt-2 mr-3"></span>
                                <p className="text-base leading-relaxed flex-1">
                                  {parts.map((part, i) => 
                                    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                                  )}
                                </p>
                              </div>
                              {/* Mostrar imagen después del bullet de Meta Mejoras */}
                              {isMetaMejorasBullet && (
                                <ImageContainer src="/meta-app-promotion-mejoras.png" alt="Meta App Promotion - Mejoras 0/9 activas" />
                              )}
                              {/* Mostrar imagen después del bullet de Meta Duplicación */}
                              {isMetaDuplicacionBullet && (
                                <ImageContainer src="/meta-app-promotion-duplicacion.png" alt="Meta App Promotion - Duplicación de anuncios" />
                              )}
                              {/* Mostrar imagen después del bullet de TikTok Placements */}
                              {isTikTokPlacementsBullet && (
                                <ImageContainer src="/tiktok-placements.png" alt="TikTok - Placements" />
                              )}
                              {/* Mostrar imagen después del bullet de TikTok Targeting */}
                              {isTikTokTargetingBullet && (
                                <ImageContainer src="/tiktok-targeting.png" alt="TikTok - Targeting" />
                              )}
                              {/* Mostrar imagen después del bullet de TikTok Bidding */}
                              {isTikTokBiddingBullet && (
                                <ImageContainer src="/tiktok-bidding.png" alt="TikTok - Bidding and Optimization" />
                              )}
                              {/* Mostrar imagen después del bullet de X Funding source */}
                              {isXFundingBullet && (
                                <ImageContainer src="/x-video-views-funding.png" alt="X - Funding source" />
                              )}
                            </div>
                          )
                        }
                        // Detectar líneas con texto en cursiva (que empiezan con *)
                        if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**') && trimmedLine.endsWith('*')) {
                          const text = trimmedLine.replace(/^\*|\*$/g, '')
                          // Detectar recordatorio de TikTok sobre Android e iOS
                          const isTikTokAppSelection = text.toLowerCase().includes('recordatorio') && text.toLowerCase().includes('android') && text.toLowerCase().includes('ios')
                          
                          return (
                            <div key={idx}>
                              <p className="ml-4 mb-1 text-base leading-relaxed italic text-gray-700">
                                {text}
                              </p>
                              {/* Mostrar imagen después del recordatorio de TikTok */}
                              {isTikTokAppSelection && (
                                <ImageContainer src="/tiktok-app-selection.png" alt="TikTok - Selección de App" />
                              )}
                            </div>
                          )
                        }
                        // Detectar línea con flecha que menciona "campañas de Google" (después del punto 2 del paso 7)
                        if (trimmedLine.includes('→') && trimmedLine.includes('campañas de Google')) {
                          const parts = trimmedLine.split(/\*\*(.*?)\*\*/g)
                          return (
                            <div key={idx}>
                              <p className="ml-4 mb-1 text-base leading-relaxed">
                                {parts.map((part, i) => 
                                  i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                                )}
                              </p>
                              <ImageContainer src="/youtube-video-link.png" alt="YouTube - Link del video para campañas de Google" />
                            </div>
                          )
                        }
                        if (trimmedLine === '') {
                          return <br key={idx} />
                        }
                        const parts = trimmedLine.split(/\*\*(.*?)\*\*/g)
                        return (
                          <p key={idx} className="mb-1 text-base leading-relaxed">
                            {parts.map((part, i) => 
                              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                            )}
                          </p>
                        )
                      })}
                    </div>
                  )
                })()}
                {/* Videos de Loom si existen - al final */}
                {(() => {
                  const training = trainings[selectedTraining]
                  const videoUrls = (training as any)?.videoUrls
                  const videoUrl = (training as any)?.videoUrl
                  const videos = videoUrls || (videoUrl ? [videoUrl] : [])
                  
                  if (videos.length === 0) return null
                  
                  return (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h2 className="text-xl font-bold mb-4 text-[#053634]">Video tutorial</h2>
                      <div className="space-y-4">
                        {videos.map((videoUrl: string, idx: number) => {
                          const videoId = videoUrl.includes('/share/') 
                            ? videoUrl.split('/share/')[1] 
                            : videoUrl.split('/').pop() || ''
                          const embedUrl = `https://www.loom.com/embed/${videoId}`
                          return (
                            <div key={idx} className="rounded-xl overflow-hidden shadow-lg bg-gray-100">
                              <div className="relative pb-[56.25%] h-0">
                                <iframe
                                  src={embedUrl}
                                  className="absolute top-0 left-0 w-full h-full border-0"
                                  allowFullScreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
