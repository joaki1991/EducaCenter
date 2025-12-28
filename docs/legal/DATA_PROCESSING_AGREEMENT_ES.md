# Contrato de Encargado del Tratamiento de Datos

**Conforme al Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD**

## Partes Contratantes

**RESPONSABLE DEL TRATAMIENTO** (La Empresa Cliente)

- Razón Social: [NOMBRE DE LA EMPRESA CLIENTE]
- CIF: [CIF DE LA EMPRESA CLIENTE]
- Domicilio: [DIRECCIÓN DE LA EMPRESA CLIENTE]
- Representante: [NOMBRE DEL REPRESENTANTE]
- Email: [EMAIL DE LA EMPRESA CLIENTE]

**ENCARGADO DEL TRATAMIENTO** (Proveedor de EducaCenter)

- Razón Social: [NOMBRE DEL PROVEEDOR DE EDUCACENTER]
- CIF: [CIF DEL PROVEEDOR]
- Domicilio: [DIRECCIÓN DEL PROVEEDOR]
- Representante: [NOMBRE DEL REPRESENTANTE]
- Email: [EMAIL DEL PROVEEDOR]

## EXPONEN

**PRIMERO.** Que el RESPONSABLE necesita contratar los servicios de control horario y gestión laboral que presta el ENCARGADO a través de la plataforma EducaCenter.

**SEGUNDO.** Que para la prestación de dichos servicios, el ENCARGADO accederá y tratará datos personales por cuenta del RESPONSABLE.

**TERCERO.** Que ambas partes reconocen la necesidad de formalizar un contrato de encargado del tratamiento conforme al artículo 28 del RGPD y el artículo 28 de la LOPDGDD.

## CLÁUSULAS

### PRIMERA. Objeto del contrato

El presente contrato tiene por objeto regular las condiciones en las que el ENCARGADO tratará los datos personales por cuenta del RESPONSABLE en el marco de la prestación de servicios de la plataforma EducaCenter.

### SEGUNDA. Datos personales objeto de tratamiento

El ENCARGADO tratará, por cuenta del RESPONSABLE, las siguientes categorías de datos:

#### 2.1. Categorías de datos
- Datos identificativos: nombre, apellidos, email, DNI/NIE
- Datos laborales: fecha de alta, centro de trabajo, horario
- Datos de fichaje: fecha/hora de entrada/salida, coordenadas GPS (opcional)
- Datos de vacaciones: solicitudes, días disponibles, aprobaciones

#### 2.2. Categorías de interesados
- Empleados de la empresa RESPONSABLE
- Administradores de la empresa RESPONSABLE

#### 2.3. Finalidades del tratamiento
- Control horario conforme al RDL 8/2019
- Gestión de vacaciones
- Generación de informes laborales
- Auditoría y trazabilidad

### TERCERA. Obligaciones del ENCARGADO

El ENCARGADO se compromete a:

#### 3.1. Tratamiento según instrucciones
Tratar los datos únicamente siguiendo las instrucciones documentadas del RESPONSABLE, que se concretan en:
- Registro de fichajes de entrada y salida
- Gestión de solicitudes de vacaciones
- Generación de informes cuando sean solicitados
- Conservación de datos durante 4 años mínimo

#### 3.2. Confidencialidad
- Garantizar que las personas autorizadas para tratar datos se comprometan a respetar la confidencialidad
- Mantener el deber de secreto respecto a los datos, incluso después de finalizar la prestación de servicios

#### 3.3. Medidas de seguridad
Implementar medidas técnicas y organizativas apropiadas:

**Técnicas:**
- Cifrado TLS/HTTPS en todas las comunicaciones
- Autenticación con JWT en cookies HTTPOnly
- Hash de contraseñas con bcrypt (12 rondas)
- Aislamiento de datos por empresa (multi-tenant)
- Copias de seguridad cifradas y periódicas
- Firewall y detección de intrusiones
- Logs de auditoría inmutables

**Organizativas:**
- Control de acceso basado en roles
- Formación del personal en protección de datos
- Procedimientos de respuesta ante brechas de seguridad
- Políticas de contraseñas seguras

#### 3.4. Subcontratación
El ENCARGADO NO subcontratará ninguna operación de tratamiento sin autorización previa, específica y por escrito del RESPONSABLE.

**Subcontratistas autorizados actualmente:**
- Proveedor de hosting: [NOMBRE DEL HOSTING, ej. Render, Railway, AWS]
- Base de datos: [PROVEEDOR DE POSTGRESQL]

#### 3.5. Asistencia al RESPONSABLE
El ENCARGADO asistirá al RESPONSABLE en:
- Responder a solicitudes de ejercicio de derechos (acceso, rectificación, supresión, etc.)
- Notificar brechas de seguridad en un plazo máximo de 24 horas
- Realizar evaluaciones de impacto cuando sea necesario
- Colaborar con las autoridades de control

#### 3.6. Transferencias internacionales
El ENCARGADO NO realizará transferencias de datos fuera del Espacio Económico Europeo sin autorización previa del RESPONSABLE.

**Ubicación de los servidores:** [PAÍS/REGIÓN, ej. Unión Europea]

### CUARTA. Obligaciones del RESPONSABLE

El RESPONSABLE se compromete a:

#### 4.1. Información a empleados
Informar a sus empleados sobre el tratamiento de datos mediante EducaCenter y obtener, cuando sea necesario, el consentimiento para la geolocalización.

#### 4.2. Base legal
Asegurar que existe una base legal válida para el tratamiento (ejecución de contrato laboral, obligación legal RDL 8/2019).

#### 4.3. Exactitud de los datos
Garantizar que los datos introducidos en la plataforma son exactos y están actualizados.

#### 4.4. Instrucciones claras
Proporcionar instrucciones claras y documentadas al ENCARGADO sobre el tratamiento.

### QUINTA. Derechos de los interesados

#### 5.1. Ejercicio de derechos
Los interesados pueden ejercer sus derechos ante el RESPONSABLE.

#### 5.2. Procedimiento
Cuando un interesado ejerza sus derechos directamente ante el ENCARGADO, este lo comunicará al RESPONSABLE en un plazo máximo de 48 horas.

#### 5.3. Limitaciones
El derecho de supresión está limitado por la obligación legal de conservar los registros de fichaje durante 4 años (RDL 8/2019).

### SEXTA. Notificación de brechas de seguridad

#### 6.1. Obligación de notificación
El ENCARGADO notificará al RESPONSABLE cualquier violación de la seguridad de los datos en un plazo máximo de **24 horas** desde que tenga conocimiento.

#### 6.2. Información a proporcionar
- Naturaleza de la violación
- Categorías y número de interesados afectados
- Medidas adoptadas para mitigar los efectos
- Consecuencias probables de la violación

#### 6.3. Colaboración
El ENCARGADO colaborará activamente en la gestión de la brecha y en la notificación a la autoridad de control si procede.

### SÉPTIMA. Auditorías e inspecciones

El RESPONSABLE tiene derecho a realizar auditorías para verificar el cumplimiento del RGPD. El ENCARGADO:

- Facilitará toda la información necesaria
- Permitirá inspecciones en sus instalaciones (previo aviso razonable)
- Colaborará activamente con auditores designados

### OCTAVA. Devolución o supresión de datos

Al finalizar la prestación de servicios, el ENCARGADO:

#### 8.1. Opciones
A elección del RESPONSABLE:
- **Devolverá** todos los datos en formato estructurado (JSON, CSV)
- **Suprimirá** todos los datos, incluyendo copias

#### 8.2. Excepciones
El ENCARGADO podrá conservar datos si existe una obligación legal (ej. 4 años para fichajes según RDL 8/2019).

#### 8.3. Plazo
La devolución o supresión se realizará en un plazo máximo de **30 días** tras la finalización del contrato.

### NOVENA. Conservación de datos

#### 9.1. Plazo mínimo
Los datos de fichaje se conservarán un mínimo de **4 años** desde su creación, conforme al RDL 8/2019.

#### 9.2. Plazo máximo
Tras el periodo de conservación obligatorio, los datos se eliminarán automáticamente, salvo instrucción contraria del RESPONSABLE.

### DÉCIMA. Duración del contrato

#### 10.1. Duración
Este contrato tiene la misma duración que el contrato de prestación de servicios de EducaCenter.

#### 10.2. Finalización
El contrato finaliza cuando:
- El RESPONSABLE cancele la suscripción
- Cualquiera de las partes resuelva el contrato principal
- Se produzca un incumplimiento grave no subsanado

### UNDÉCIMA. Responsabilidad

#### 11.1. Responsabilidad del ENCARGADO
El ENCARGADO será responsable de los daños causados por tratamientos que incumplan el RGPD o las instrucciones del RESPONSABLE.

#### 11.2. Limitación
La responsabilidad se limita a los daños directos, con un límite máximo de [CANTIDAD EN EUROS] o el importe de las cuotas pagadas en los últimos 12 meses (el mayor de ambos).

#### 11.3. Exclusiones
El ENCARGADO NO será responsable si demuestra que el daño se debe a:
- Instrucciones incorrectas del RESPONSABLE
- Uso inadecuado de la plataforma por los usuarios
- Causas de fuerza mayor

### DUODÉCIMA. Modificaciones

Cualquier modificación de este contrato deberá realizarse por escrito y estar firmada por ambas partes.

### DECIMOTERCERA. Legislación y jurisdicción

#### 13.1. Legislación aplicable
Este contrato se rige por la legislación española y el RGPD.

#### 13.2. Jurisdicción
Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de [CIUDAD/PROVINCIA].

### DECIMOCUARTA. Aceptación

Ambas partes aceptan el presente contrato y se comprometen a su cumplimiento.

---

**Firmado en [CIUDAD], a [FECHA]**

**Por el RESPONSABLE:**

Nombre: _______________________  
DNI: _______________________  
Firma: _______________________

**Por el ENCARGADO:**

Nombre: _______________________  
DNI: _______________________  
Firma: _______________________

---

## ANEXO I: Medidas de Seguridad Implementadas

1. **Cifrado:**
   - TLS 1.3 en tránsito
   - Cifrado AES-256 en reposo

2. **Autenticación:**
   - JWT en cookies HTTPOnly
   - Tokens con expiración (2 horas)
   - Contraseñas hasheadas con bcrypt (12 rondas)

3. **Control de acceso:**
   - RBAC (Role-Based Access Control)
   - Multi-tenant con aislamiento estricto
   - Middleware de autorización en todas las operaciones

4. **Auditoría:**
   - Logs inmutables de todas las acciones
   - Trazabilidad completa de cambios
   - Conservación de logs durante 4 años

5. **Copias de seguridad:**
   - Backup diario automatizado
   - Retención de 30 días
   - Cifrado de backups

6. **Monitorización:**
   - Alertas de intentos de acceso no autorizado
   - Monitorización de uso de recursos
   - Detección de anomalías

7. **Protección contra amenazas:**
   - Firewall de aplicación web (WAF)
   - Protección CSRF
   - Protección XSS
   - Rate limiting

## ANEXO II: Procedimiento de Ejercicio de Derechos

Los interesados pueden ejercer sus derechos mediante email a: [EMAIL DEL RESPONSABLE]

**Plazo de respuesta:** 1 mes (prorrogable 2 meses si la solicitud es compleja)

**Derechos disponibles:**
- Acceso: Exportación de todos sus datos
- Rectificación: Corrección de datos inexactos
- Supresión: Eliminación (salvo obligación de conservación)
- Limitación: Suspensión temporal del tratamiento
- Portabilidad: Datos en formato JSON/CSV
- Oposición: Al tratamiento basado en interés legítimo
