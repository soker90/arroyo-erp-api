# arroyo-erp-api
Backend de Arroyo ERP, hecho con node.js, express y graphql. Un backoffice para gestión de pymes.

---
## Requirements

Para desarrollar necesitas Node.js y un gestor de paquetes para node como npm.

### Node
- #### Instalación en ArchLinux

  Puedes instalar nodejs y npm fácilmente con apt, con los siguientes comandos

      $ sudo pacman -Sy nodejs npm
      
- #### Instalación de Ubuntu

  Puedes instalar nodejs y npm fácilmente con apt, con los siguientes comandos

      $ sudo apt install nodejs
      $ sudo apt install npm
      
- #### Instalación en Windows

  Descarga Node.js del [sitio oficial](https://nodejs.org/) e instalalo.

  Si se ha instalado correctamente, deberías poder ejecutar los siguientes comandos:

      $ node --version
      v14.3.0

      $ npm --version
      6.14.5

  Si necesitas actualizar `npm`, puedes hacerlo usando `npm`:

      $ npm install npm -g

---

## Instalación

    $ git clone https://github.com/soker90/arroyo-erp-server
    $ cd arroyo-erp-server
    $ npm i

## Ejecución

    $ npm start
    
### En desarrollo
    $ npm run start:dev
