import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

// Servicios
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const DatoSolicitanteAdd: React.FC<any> = (props: any) => {
  const [[l_tipo_profesional, l_tipo_documento], setLTipoDocumento] = useState<IDominio[][]>([[], []]);

  //#region Cargar Listas

  const getLista = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_type(ETipoDominio['Tipo de Profesional']),
        dominioService.get_type(ETipoDominio['Tipo Documento'])
      ]);
      setLTipoDocumento(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form.Item label='Tipo documento' initialValue={null} required={true} name='fiscalia'>
        <SelectComponent
          options={l_tipo_documento.filter((i) =>
            [
              'a4ee4462-f837-4dff-a800-5495c33ac3ce',
              'f1b570ee-f628-4438-a47f-6d7bff1f06d7',
              '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
            ].includes(i.id)
          )}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>

      <Form.Item label='Numero documento' initialValue={null} required={true} name='ndoc'>
        <Input allowClear placeholder='Numero documento' autoComplete='off' />
      </Form.Item>

      <Form.Item label='Nombres' initialValue={null} required={true} name='namesolicitudadd'>
        <Input allowClear placeholder='Nombres' autoComplete='off' />
      </Form.Item>

      <Form.Item label='Apellidos' initialValue={null} required={true} name='lastnamesolicitudadd'>
        <Input allowClear placeholder='Apellidos' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Email' initialValue={null} required={true} name='emailsolicitudadd'>
        <Input allowClear placeholder='Email' autoComplete='off' />
      </Form.Item>
    </>
  );
};
