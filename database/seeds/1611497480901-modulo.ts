import {
  Modulo,
  Propiedades,
} from '../../src/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // MENU SECCION PRINCIPAL
      {
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          descripcion: 'Sección principal',
          orden: 1,
        },
        subMenus: [
          {
            nombre: 'inicio',
            url: '/admin/home',
            label: 'Inicio',
            propiedades: {
              icono: 'home',
              descripcion:
                'Vista de bienvenida con características del sistema',
              orden: 1,
            },
          },
          {
            nombre: 'perfil',
            url: '/admin/perfil',
            label: 'Perfil',
            propiedades: {
              icono: 'person',
              descripcion:
                'Información del perfil de usuario que inicio sesión',
              orden: 2,
            },
          },
        ],
      },
      // MENU SECCION CONFIGURACIONES
      {
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuración',
        propiedades: {
          descripcion: 'Sección de configuraciones',
          orden: 2,
        },
        subMenus: [
          {
            nombre: 'usuarios',
            url: '/admin/usuarios',
            label: 'Usuarios',
            propiedades: {
              icono: 'manage_accounts',
              descripcion: 'Control de usuarios del sistema',
              orden: 1,
            },
          },
          {
            nombre: 'parametros',
            url: '/admin/parametros',
            label: 'Mis Películas',
            propiedades: {
              icono: 'tune',
              descripcion: 'Mis películas',
              orden: 2,
            },
          },
        ],
      },
    ]

    for (const item of items) {
      const propiedades: Propiedades = {
        orden: item.propiedades.orden,
        descripcion: item.propiedades.descripcion,
      }
      const modulo = await queryRunner.manager.save(
        new Modulo({
          nombre: item.nombre,
          url: item.url,
          label: item.label,
          propiedades: propiedades,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )

      for (const subMenu of item.subMenus) {
        const propiedad: Propiedades = {
          icono: subMenu.propiedades.icono,
          descripcion: subMenu.propiedades.descripcion,
          orden: subMenu.propiedades.orden,
        }
        await queryRunner.manager.save(
          new Modulo({
            nombre: subMenu.nombre,
            url: subMenu.url,
            label: subMenu.label,
            idModulo: modulo.id,
            propiedades: propiedad,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
        )
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
