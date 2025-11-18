# Instrucciones para Deploy en Vercel

## Paso 1: Inicializar Git y subir a GitHub

1. Abre la terminal en la carpeta del proyecto
2. Ejecuta estos comandos:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: AstroPay Hub"

# Crear un repositorio en GitHub (ve a github.com y crea uno nuevo)
# Luego conecta tu repositorio local con el remoto:
git remote add origin https://github.com/bautista-hike/AstroHUB_Oficial
git branch -M main
git push -u origin main
```

## Paso 2: Configurar Vercel

1. Ve a https://vercel.com y crea una cuenta o inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. NO cambies ninguna configuración de build, deja todo por defecto

## Paso 3: Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto → Settings → Environment Variables

Agrega estas variables (las mismas que tienes en tu .env.local):

```
GOOGLE_SHEETS_SPREADSHEET_ID=tu_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu_service_account_email
GOOGLE_PRIVATE_KEY=tu_private_key_completo
```

**IMPORTANTE para GOOGLE_PRIVATE_KEY:**
- Copia TODO el contenido de la clave privada, incluyendo las líneas de inicio y fin
- Incluye los saltos de línea (\n) o reemplázalos por \\n
- Ejemplo: "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

## Paso 4: Deploy

1. Vercel hará el deploy automáticamente después de conectar el repo
2. Si necesitas hacer un nuevo deploy, simplemente haz push a GitHub:
   ```bash
   git add .
   git commit -m "Tu mensaje"
   git push
   ```

## Paso 5: Verificar

1. Una vez completado el deploy, Vercel te dará una URL (ej: tu-proyecto.vercel.app)
2. Visita la URL y verifica que todo funcione
3. Si hay errores, revisa los logs en Vercel Dashboard → Deployments → selecciona el deploy → Logs

## Notas importantes:

- Las imágenes en `/public` estarán disponibles en producción
- La hoja "CREATIVES" en Google Sheets es opcional (si no existe, retornará array vacío)
- Asegúrate de que las credenciales de Google Sheets tengan permisos de lectura
- El proyecto usa Next.js 15, que es compatible con Vercel

