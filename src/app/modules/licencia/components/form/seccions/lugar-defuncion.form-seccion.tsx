import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Servicios
import { dominioService, ETipoDominio, IDepartamento, IMunicipio, IDominio } from 'app/services/dominio.service';

export const LugarDefuncionFormSeccion: React.FC<ILugarDefuncionProps<any>> = (props) => {
  //#region Listados

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises, l_sitio_defuncion, l_area_defuncion], setListas] = useState<
    [IDepartamento[], IDominio[], IDominio[], IDominio[]]
  >([[], [], [], []]);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const getListas = useCallback(
    async () => {
      const [municipios, ...resp] = await Promise.all([
        dominioService.get_municipios_by_departamento(idDepartamentoBogota),
        dominioService.get_departamentos_colombia(),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Sitio de Defuncion']),
        dominioService.get_type(ETipoDominio['Area de Defuncion'])
      ]);
      setLMunicipios(municipios);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const [isColombia, setIsColombia] = useState(true);
  const onChangePais = (value: string) => {
    setIsColombia(value === idColombia);
    props.form.setFieldsValue({ state: undefined, city: undefined });
  };
  const onChangeDepartamento = async (value: string) => {
    props.form.setFieldsValue({ city: undefined });
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
  };

  const { obj } = props;

  return (
    <>
      <Divider orientation='right'>Lugar de Defunci??n</Divider>

      <Form.Item label='Pa??s' name='country' initialValue={obj?.country ? obj?.country : idColombia} rules={[{ required: true }]}>
        <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
      </Form.Item>

      <Form.Item
        label='Departamento Defunci??n'
        name='state'
        initialValue={obj?.state ? obj?.state : idDepartamentoBogota}
        rules={[{ required: isColombia }]}
      >
        <SelectComponent
          options={l_departamentos_colombia}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          onChange={onChangeDepartamento}
          disabled={!isColombia}
        />
      </Form.Item>

      <Form.Item
        label='Municipio Defunci??n'
        name='city'
        initialValue={obj?.city ? obj?.city : '31211657-3386-420a-8620-f9c07a8ca491'}
        rules={[{ required: isColombia }]}
      >
        <SelectComponent
          options={l_municipios}
          optionPropkey='idMunicipio'
          optionPropLabel='descripcion'
          disabled={!isColombia}
        />
      </Form.Item>

      <Form.Item
        label='??rea Defunci??n'
        name='areaDef'
        initialValue={obj?.areaDef ? obj?.areaDef : 'dcb9985a-6e4f-45b6-ab53-c8105d0b9cc3'}
        rules={[{ required: true }]}
      >
        <SelectComponent options={l_area_defuncion} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>

      <Form.Item
        label='Sitio Defunci??n'
        name='sitDef'
        initialValue={obj?.sitDef ? obj?.sitDef : '00a1b1f5-a286-495d-88fe-119406111e32'}
        rules={[{ required: true }]}
      >
        <SelectComponent options={l_sitio_defuncion} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
    </>
  );
};

export const KeysForm = ['state', 'city', 'country', 'areaDef', 'sitDef'];

interface ILugarDefuncionProps<T> {
  form: FormInstance<T>;
  obj: any;
}
