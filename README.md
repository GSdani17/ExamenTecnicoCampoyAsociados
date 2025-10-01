# ExamenTecnicoCampoyAsociados
Prueba Técnica realizada  para la vacante de Desarrollador Web Full Stack  (ReactJS + NodeJS + SQL Server)   de la Empresa Del Campo y Asociados



ejecute el script de la base de datos
(Se recomienda ir uno x uno en el script )
en la tabla Usuario puedes poner cualquier usuario y contraseña para logearte y entrar al crud
(en el script viene  un "insert into Usuario (NombreUsuario,Contraseña) values ('admin','123')";



pasos para instalar backend

entra a la carpeta del backend y pon   "npm install"  para instalar dependencias(ocupas tener la misma version node.js instalado y npm del proyecto en tu maquina)
en el archivo .env pones tus credenciales de tu servidor de base de datos(sí no esta el archivo entonces créalo)
por ejemplo:

DB_USER=GastonDaniel
DB_PASSWORD=123
DB_SERVER=GASTONDANIEL
DB_DATABASE=ExamenDelCampoAsociados
DB_PORT=1433

para correr el backed utiliza  "npm start " o "npm run start "
o puedes instalar "npm install nodemon" y correr el servidor con  "npm run dev"



para instalar el frontend

entra a la carpeta del frontend y instala las dependencias(npm install)

para ejecutar el programa se utiliza
npm start o npm run start

Esto levanta el servidor de desarrollo de React (por defecto en http://localhost:3000 o :3001 si el backend usa el 3000).

Si React necesita apuntar a la API del backend, revisar que la variable REACT_APP_API_URL esté correcta.
por ejemplo(REACT_APP_API_URL=http://localhost:3000/api)

en mi caso esta es la api por defecto de mi backend const API_URL = "http://localhost:3000/api/empleados";

se recomienda primero levantar el servidor del backend y luego el de frontend para que no haiga confictos con los puertos o instalar otra librería del react para cambiar de puerto
