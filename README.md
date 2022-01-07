# arroyo-erp-api

![GitHub](https://img.shields.io/github/license/soker90/arroyo-erp-api)
![](https://github.com/soker90/arroyo-erp-api/workflows/Node.js%20CI/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=soker90_arroyo-erp-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=soker90_arroyo-erp-api)
[![codecov](https://codecov.io/gh/soker90/arroyo-erp-api/branch/master/graph/badge.svg)](https://codecov.io/gh/soker90/arroyo-erp-api)

Backend de Arroyo ERP, hecho con node.js y express. Un backoffice para gestión de pymes.
---
## TODO
- [ ] Swagger 
---
## Requisitos

Para desarrollar necesitas Node.js y un gestor de paquetes para node como npm.

### Node
- #### Instalación en ArchLinux

  Puedes instalar nodejs y npm fácilmente con pacman, con los siguientes comandos

      $ sudo pacman -Sy nodejs npm

- #### Instalación de Debian, Ubuntu y derivados

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

    $ git clone https://github.com/soker90/arroyo-erp-api
    $ cd arroyo-erp-api
    $ npm i

## Ejecución

    $ npm start

### En desarrollo
    $ npm run start:dev
