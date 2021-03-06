import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import { Row, Col } from 'antd';

// Utilidades
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Servicios
import { dominioService, ETipoDominio, IDepartamento, IMunicipio, IDominio, ICementerio } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { validateClaimsRequest } from 'msal/lib-commonjs/AuthenticationParameters';

interface municiopioDepartament {
  municipio: string;
  departament: string;
}

export const CementerioInfoFormSeccion: React.FC<ICementerioInfoProps<any>> = (props) => {
  const { form, tipoLicencia } = props;
  const { obj } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  //#region Listados

  const [isMunicipio, setMunicipio] = useState<municiopioDepartament>({
    municipio: '',
    departament: ''
  });

  const [l_funerarias, setLfunerarias] = useState<ICementerio[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_municipiosfunerarias, setLMunicipiosfunerarias] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_cementerios, l_paises], setListas] = useState<[IDepartamento[], ICementerio[], IDominio[]]>(
    [[], [], []]
  );

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_departamentos_colombia(),
        dominioService.get_cementerios_bogota(),
        dominioService.get_type(ETipoDominio.Pais)
      ]);
      const funeraria = await api.GetFunerarias();
      setLfunerarias(funeraria);
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
  //#region Acciones del formulario
  const cota = 'b5c40416-db96-4d1d-a5bd-da0ce61930e7';
  const soacha = '2ad1a949-02a7-4e93-88f9-d39b98f2871f';
  const cundinamarca = '1029c7b3-e8c7-46e6-8275-3e568e06e03c';

  const lugarCementerio = obj?.isLugar();

  const [lugar, setLugar] = useState<TypeLugarCementerio>(lugarCementerio);

  const lugarFuneraria = obj?.isLugar();

  const [lugarfuneraria, setLugarFuneraria] = useState<TypeLugarFuneraria>(lugarFuneraria);

  const onChangeLugarCementerio = (e: RadioChangeEvent) => {
    form.resetFields([
      'cementerioBogota',
      'cementerioDepartamento',
      'cementerioMunicipio',
      'cementerioPais',
      'cementerioCiudad',
      'emailcementerio'
    ]);
    setLMunicipios([]);
    setLugar(e.target.value);
  };
  const onChangeLugarFuneraria = (e: RadioChangeEvent) => {
    form.resetFields([
      'funerariaBogota',
      'funerariaDepartamento',
      'funerariaMunicipio',
      'funerariaPais',
      'funerariaCiudad',
      'emailfuneraria'
    ]);
    setLMunicipiosfunerarias([]);
    setLugarFuneraria(e.target.value);
  };
  const onChangeDepartamentoFuneraria = async (value: string) => {
    const depart = await dominioService.get_departamentos_colombia();
    let id = (await depart).filter((i) => i.idDepartamento == value);

    let idmunicipio = id[0].idDepPai + '';

    form.resetFields(['funerariaMunicipio']);
    const resp = await dominioService.get_municipios_by_departamento(idmunicipio);

    setLMunicipiosfunerarias(resp);
    console.log(l_municipios);
  };

  const onChangeMunicipioFuneraria = async (value: string) => {
    const departament = form.getFieldValue('funerariaDepartamento');

    setMunicipio({
      departament: departament,
      municipio: value
    });
  };

  const onChangeDepartamento = async (value: string) => {
    const depart = await dominioService.get_departamentos_colombia();
    let id = (await depart).filter((i) => i.idDepartamento == value);

    let idmunicipio = id[0].idDepPai + '';

    form.resetFields(['cementerioMunicipio']);
    const resp = await dominioService.get_municipios_by_departamento(idmunicipio);

    setLMunicipios(resp);
    console.log(l_municipiosfunerarias);
  };

  const onChangeMunicipio = async (value: string) => {
    const departament = form.getFieldValue('cementerioDepartamento');

    setMunicipio({
      departament: departament,
      municipio: value
    });
  };

  //#endregion

  const renderForm = (_lugar: TypeLugarCementerio) => {
    switch (_lugar) {
      case 'Fuera de Bogot??':
        return (
          <div className='fadeInRight'>
            <Form.Item
              label='Departamento de Colombia'
              name='cementerioDepartamento'
              rules={[{ required: true }]}
              initialValue={obj?.cementerioDepartamento}
            >
              <SelectComponent
                options={l_departamentos_colombia.filter((i) => i.descripcion !== 'BOGOT?? D.C.')}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                onChange={onChangeDepartamento}
              />
            </Form.Item>
            <Form.Item
              label='Municipio'
              name='cementerioMunicipio'
              initialValue={obj?.cementerioMunicipio}
              rules={[{ required: true }]}
            >
              <SelectComponent
                options={l_municipios}
                optionPropkey='idMunicipio'
                optionPropLabel='descripcion'
                onChange={onChangeMunicipio}
              />
            </Form.Item>
            {isMunicipio.departament === cundinamarca && (isMunicipio.municipio === cota || isMunicipio.municipio === soacha) && (
              <Form.Item label='Otro sitio' name='otro' rules={[{ required: true }]} initialValue={obj?.otro}>
                <Input allowClear placeholder='Otro Sitio' autoComplete='off' />
              </Form.Item>
            )}
          </div>
        );

      case 'Fuera del Pa??s':
        return (
          <div className='fadeInRight'>
            <Form.Item label='Pa??s' name='cementerioPais' rules={[{ required: true }]} initialValue={obj?.cementerioPais}>
              <SelectComponent
                options={l_paises.filter((i) => i.descripcion !== 'Colombia')}
                optionPropkey='descripcion  '
                optionPropLabel='descripcion'
              />
            </Form.Item>
            <Form.Item label='Ciudad' name='cementerioCiudad' initialValue={obj?.cementerioCiudad} rules={[{ required: true }]}>
              <Input allowClear placeholder='Ciudad' autoComplete='off' />
            </Form.Item>
          </div>
        );

      default:
        return (
          <>
            <Form.Item
              className='fadeInRight'
              label='Cementerio de Bogot?? D.C.'
              name='cementerioBogota'
              initialValue={obj?.cementerioBogota}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_cementerios} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
            </Form.Item>
          </>
        );
    }
  };

  const renderFormFuneria = (_lugar: TypeLugarFuneraria) => {
    switch (_lugar) {
      case 'Fuera de Bogot??':
        return (
          <div className='fadeInRight'>
            <Form.Item
              label='Departamento de Colombia'
              name='funerariaDepartamento'
              rules={[{ required: true }]}
              initialValue={obj?.cementerioDepartamento}
            >
              <SelectComponent
                options={l_departamentos_colombia.filter((i) => i.descripcion !== 'BOGOT?? D.C.')}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                onChange={onChangeDepartamentoFuneraria}
              />
            </Form.Item>
            <Form.Item
              label='Municipio'
              name='funerariaMunicipio'
              initialValue={obj?.cementerioMunicipio}
              rules={[{ required: true }]}
            >
              <SelectComponent
                options={l_municipiosfunerarias}
                optionPropkey='idMunicipio'
                optionPropLabel='descripcion'
                onChange={onChangeMunicipioFuneraria}
              />
            </Form.Item>
            {isMunicipio.departament === cundinamarca && (isMunicipio.municipio === cota || isMunicipio.municipio === soacha) && (
              <Form.Item label='Otro sitio funeraria' name='otrofuneraria' rules={[{ required: true }]} initialValue={obj?.otro}>
                <Input allowClear placeholder='Otro Sitio' autoComplete='off' />
              </Form.Item>
            )}
          </div>
        );

      case 'Fuera del Pa??s':
        return (
          <div className='fadeInRight'>
            <Form.Item label='Pa??s' name='funerariaPais' rules={[{ required: true }]} initialValue={obj?.cementerioPais}>
              <SelectComponent
                options={l_paises.filter((i) => i.descripcion !== 'Colombia')}
                optionPropkey='descripcion  '
                optionPropLabel='descripcion'
              />
            </Form.Item>
            <Form.Item label='Ciudad' name='funerariaCiudad' initialValue={obj?.cementerioCiudad} rules={[{ required: true }]}>
              <Input allowClear placeholder='Ciudad' autoComplete='off' />
            </Form.Item>
          </div>
        );

      default:
        return (
          <>
            <Form.Item
              className='fadeInRight'
              label='Funeraria de Bogot?? D.C.'
              name='funerariaBogota'
              initialValue={obj?.cementerioBogota}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_funerarias} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
            </Form.Item>
          </>
        );
    }
  };

  return (
    <>
      <Divider orientation='right'>Datos de la funeraria y Cementerio a realizar la {tipoLicencia}</Divider>
      <div>
        <Form.Item
          className='mb-4'
          label='Lugar del cementerio'
          name='cementerioLugar'
          initialValue={obj?.isLugar() ?? 'Dentro de Bogot??'}
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onChangeLugarCementerio}>
            <Radio value='Dentro de Bogot??'>DENTRO DE BOGOT??</Radio>
            <br />
            <Radio value='Fuera de Bogot??'>FUERA DE BOGOT??</Radio>
            <br />
            <Radio value='Fuera del Pa??s'>FUERA DEL PA??S</Radio>
          </Radio.Group>
        </Form.Item>
        {renderForm(lugar)}
      </div>
      <div>
        <Form.Item
          className='mb-4'
          label='Lugar de la Funeraria'
          name='funerariaLugar'
          initialValue={obj?.isLugar() ?? 'Dentro de Bogot??'}
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onChangeLugarFuneraria}>
            <Radio value='Dentro de Bogot??'>DENTRO DE BOGOT??</Radio>
            <br />
            <Radio value='Fuera de Bogot??'>FUERA DE BOGOT??</Radio>
            <br />
            <Radio value='Fuera del Pa??s'>FUERA DEL PA??S</Radio>
          </Radio.Group>
        </Form.Item>
        {renderFormFuneria(lugarfuneraria)}
      </div>

      <Form.Item label='Email Cementerio' name='emailcementerio' rules={[{ required: true }]}>
        <Input allowClear placeholder='Email Cementerio' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Email Funeraria' name='emailfuneraria' rules={[{ required: true }]}>
        <Input allowClear placeholder='Email Funeraria' autoComplete='off' />
      </Form.Item>
    </>
  );
};

export const KeysForm = [
  'cementerioLugar',
  'cementerioBogota',
  'cementerioDepartamento',
  'cementerioMunicipio',
  'cementerioPais',
  'cementerioCiudad',
  'emailcementerio',
  'emailfuneraria'
];

interface ICementerioInfoProps<T> extends ITipoLicencia {
  form: FormInstance<T>;
  obj: any;
}

type TypeLugarCementerio = 'Dentro de Bogot??' | 'Fuera de Bogot??' | 'Fuera del Pa??s';
type TypeLugarFuneraria = 'Dentro de Bogot??' | 'Fuera de Bogot??' | 'Fuera del Pa??s';
