import React, { useCallback, useEffect, useState } from 'react';
// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Steps from 'antd/es/steps';
import Button from 'antd/es/button';
// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
// Hooks
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
// Utilidades
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { ITipoLicencia } from 'app/shared/utils/types.util';
// Secciones del formulario
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { LugarDefuncionFormSeccion, KeysForm as KeyFormLugarDefuncion } from './seccions/lugar-defuncion.form-seccion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { MedicalSignatureFormSeccion, KeysForm as KeyFormMedicalSignature } from './seccions/medical-signature.form-seccion';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { SolicitudInfoFormSeccion, KeysForm as KeyFormSolicitudInfo } from './seccions/solicitud-info.form-seccion';
import { DocumentosFormSeccion } from './seccions/documentos.form-seccion';

// Servicios
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';
import Divider from 'antd/es/divider';
import { RadioChangeEvent } from 'antd/es/radio';
import { FamilarFetalCremacion } from './familarCremacion';
import { DocumentosSoporte, IRegistroLicencia } from 'app/Models/IRegistroLicencia';
import moment from 'moment';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { IEstadoSolicitud } from 'app/Models/IEstadoSolicitud';

const { Step } = Steps;

export const FetalForm: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  //#region Listados

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);
  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);
  const [estado, setEstado] = useState<IEstadoSolicitud>();
  const idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idupz = 'd869bc18-4fca-422a-9a09-a88d3911dc8c';
  const idbarrio = '4674c6b9-1e5f-4446-8b2a-1a986a10ca2e';
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      const [departamentos, localidades, listMunicipio, upzLocalidad, ...resp] = await Promise.all([
        dominioService.get_departamentos_colombia(),
        dominioService.get_localidades_bogota(),
        dominioService.get_municipios_by_departamento(idDepartamentoBogota),
        dominioService.get_upz_by_localidad(idlocalidad),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
      ]);
      const reqEstado = await api.GetEstadoSolicitud(accountIdentifier);
      console.log(reqEstado);
      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setListas(resp);
      setLMunicipios(listMunicipio);
      setLAreas(upzLocalidad);
      onChangeArea(idupz);
      //setEstado(reqEstado[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;

    const json: IRegistroLicencia<any> = {
      solicitud: {
        numeroCertificado: values.certificado,
        fechaDefuncion: moment(values.date).format(formatDate),
        sinEstablecer: values.check,
        hora: values.check === true ? null : moment(values.time).format('LT'),
        idSexo: values.sex,
        estadoSolicitud: estadoSolicitud,
        idPersonaVentanilla: 0, //numero de usuario registrado
        idUsuarioSeguridad: accountIdentifier,
        idTramite: 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e',
        idTipoMuerte: values.deathType,
        persona: [
          //madre
          {
            tipoIdentificacion: values.IDType,
            numeroIdentificacion: values.IDNumber,
            primerNombre: values.namemother,
            segundoNombre: values.secondNamemother,
            primerApellido: values.surnamemother,
            segundoApellido: values.secondSurnamemother,
            fechaNacimiento: null,
            nacionalidad: values.nationalidadmother[0],
            otroParentesco: null,
            idEstadoCivil: values.civilStatusmother,
            idNivelEducativo: values.educationLevelmother,
            idEtnia: values.etniamother,
            idRegimen: '00000000-0000-0000-0000-000000000000',
            idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
            idParentesco: '00000000-0000-0000-0000-000000000000',
            idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
          },
          //authorizador cremacion
          {
            tipoIdentificacion: values.authIDType,
            numeroIdentificacion: values.mauthIDNumber,
            primerNombre: values.authName,
            segundoNombre: values.authSecondName,
            primerApellido: values.authSurname,
            segundoApellido: values.authSecondSurname,
            fechaNacimiento: null,
            nacionalidad: '00000000-0000-0000-0000-000000000000',
            otroParentesco: null, //lista parentesco
            idEstadoCivil: '00000000-0000-0000-0000-000000000000',
            idNivelEducativo: '00000000-0000-0000-0000-000000000000',
            idEtnia: '00000000-0000-0000-0000-000000000000',
            idRegimen: '00000000-0000-0000-0000-000000000000',
            idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
            idParentesco: '00000000-0000-0000-0000-000000000000',
            idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
          },
          //certifica la defuncion
          {
            tipoIdentificacion: values.medicalSignatureIDType,
            numeroIdentificacion: values.medicalSignatureIDNumber,
            primerNombre: values.medicalSignatureName,
            segundoNombre: values.medicalSignatureSecondName,
            primerApellido: values.medicalSignatureSurname,
            segundoApellido: values.medicalSignatureSecondSurname,
            fechaNacimiento: null,
            nacionalidad: '00000000-0000-0000-0000-000000000000',
            otroParentesco: null,
            idEstadoCivil: '00000000-0000-0000-0000-000000000000',
            idNivelEducativo: '00000000-0000-0000-0000-000000000000',
            idEtnia: '00000000-0000-0000-0000-000000000000',
            idRegimen: '00000000-0000-0000-0000-000000000000',
            idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
            idParentesco: '00000000-0000-0000-0000-000000000000',
            idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
            idTipoProfesional: values.medicalSignatureProfesionalType
          }
        ],
        lugarDefuncion: {
          idPais: values.country,
          idDepartamento: values.state,
          idMunicipio: values.city,
          idAreaDefuncion: values.areaDef,
          idSitioDefuncion: values.sitDef
        },
        ubicacionPersona: {
          idPaisResidencia: values.pais,
          idDepartamentoResidencia: values.departamento,
          idCiudadResidencia: values.ciudad,
          idLocalidadResidencia: values.localidad,
          idAreaResidencia: values.area,
          idBarrioResidencia: values.barrio
        },
        datosCementerio: {
          enBogota: values.cementerioLugar === 'Dentro de Bogotá',
          fueraBogota: values.cementerioLugar === 'Fuera de Bogotá',
          fueraPais: values.cementerioLugar === 'Fuera del País',
          cementerio: values.cementerioBogota,
          otroSitio: values.otro,
          ciudad: values.cementerioCiudad,
          idPais: values.cementerioPais,
          idDepartamento: values.cementerioDepartamento,
          idMunicipio: values.cementerioMunicipio
        },
        institucionCertificaFallecimiento: {
          tipoIdentificacion: values.instTipoIdent,
          numeroIdentificacion: values.instNumIdent,
          razonSocial: values.instRazonSocial,
          numeroProtocolo: values.instNumProtocolo,
          numeroActaLevantamiento: values.instNumActaLevantamiento,
          fechaActa: moment(values.instFechaActa).format(formatDate),
          seccionalFiscalia: values.instSeccionalFiscalia,
          noFiscal: values.instNoFiscal,
          idTipoInstitucion: values.instType
        }
        // documentosSoporte: generateFormFiel(values.instType)
      }
    };
    console.log(values, json);

    const resp = await api.postLicencia(json);
    console.log(resp);
    /*  if (resp) {
      setCurrent(0);
      form.resetFields();
    } */
  };

  const onSubmitFailed = () => setStatus('error');

  const generateFormFiel = (tipoInstitucion: string): DocumentosSoporte[] => {
    let data: DocumentosSoporte[] = [];
    if (tipoInstitucion) {
      data = [
        {
          idTipoDocumentoSoporte: 'Certificado Defunción',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento de la Madre',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Otros Documentos',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        }
      ];
    }
    if (tipoInstitucion) {
      data = [
        {
          idTipoDocumentoSoporte: 'Certificado Defunción',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento de la Madre',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Otros Documentos',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion del fiscal para cremar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Oficio de medicina legal al fiscal para cremar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Acta Notarial del Fiscal',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        }
      ];
    }
    return data;
  };

  //#region Eventos formulario

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_areas, setLAreas] = useState<IUpz[]>([]);
  const [l_barrios, setLBarrios] = useState<IBarrio[]>([]);

  const [isColombia, setIsColombia] = useState(true);
  const [isBogota, setIsBogota] = useState(true);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const onChangePais = (value: string) => {
    form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
    setIsColombia(value === idColombia);
    setLMunicipios([]);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeDepartamento = async (value: string) => {
    form.resetFields(['ciudad', 'localidad', 'area', 'barrio']);
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeMunicipio = (value: string) => {
    form.resetFields(['localidad', 'area', 'barrio']);
    setIsBogota(value === idBogota);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeLocalidad = async (value: string) => {
    form.resetFields(['area', 'barrio']);
    const resp = await dominioService.get_upz_by_localidad(value);
    setLAreas(resp);
    setLBarrios([]);
  };

  const onChangeArea = async (value: string) => {
    form.resetFields(['barrio']);
    const resp = await dominioService.get_barrio_by_upz(value);
    setLBarrios(resp);
  };
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    //setIsOtherParentesco(e.target.value === 'Otro');
  };

  //#endregion

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Steps
          className='mb-5 mr-5'
          current={current}
          status={status}
          onChange={setCurrent}
          direction='vertical'
          style={{ maxWidth: 250 }}
        >
          <Step title='Información General' description='Datos Certificación del fallecimiento.' />
          <Step title='Información de la Madre' description='Información general de la Madre.' />
          <Step
            title='Información del Solicitante'
            description='Datos o información de la funeraria o solicitante, datos del fallecimiento, solicitud y otros datos.'
          />
          <Step title='Información Certificado' description='Datos de Quien Certifica la defunción - Medico' />
          <Step title='Documentos Requeridos' description='Documentos de soporte pdf.' />
        </Steps>

        <Form
          form={form}
          className='mb-4 w-100'
          {...layoutItems}
          style={{ maxWidth: 800 }}
          layout='horizontal'
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
        >
          <div className={`d-none fadeInRight ${current === 0 && 'd-block'}`}>
            <GeneralInfoFormSeccion />
            <LugarDefuncionFormSeccion form={form} />
            <DeathInstituteFormSeccion form={form} datofiscal={true} required={false} tipoLicencia={tipoLicencia} />
            <Divider orientation='right'> Tipo de Muerte </Divider>
            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormLugarDefuncion])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
            <Divider orientation='right'> INFORMACION DE LA MADRE</Divider>
            <Form.Item
              label='Tipo Identificación'
              name='IDType'
              rules={[{ required: true }]}
              initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
            >
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
              <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
            </Form.Item>

            <Form.Item label='Primer Nombre' name='namemother' rules={[{ required: true }]}>
              <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Nombre' name='secondNamemother'>
              <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Primer Apellido' name='surnamemother' rules={[{ required: true }]}>
              <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Apellido' name='secondSurnamemother'>
              <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
            </Form.Item>

            <Form.Item
              label='Nacionalidad de la Madre'
              name='nationalidadmother'
              initialValue={[idColombia]}
              rules={[{ required: true, type: 'array' }]}
            >
              <SelectComponent
                options={l_paises}
                mode='multiple'
                placeholder='-- Elija una o varias --'
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>

            <Form.Item label='Estado Civil' name='civilStatusmother' initialValue='4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'>
              <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Nivel Educativo' name='educationLevelmother' initialValue='07ebd0bb-2b00-4a2b-8db5-4582eee1d285'>
              <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Etnia' name='etniamother' initialValue='60875c52-9b2a-4836-8bc7-2f3648f41f57'>
              <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Divider orientation='right'> RESIDENCIA HABITUAL DE LA MADRE</Divider>
            <Form.Item label='País de Residencia' name='pais' initialValue={idColombia} rules={[{ required: true }]}>
              <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
            </Form.Item>

            <Form.Item
              label='Departamento de Residencia'
              initialValue={idDepartamentoBogota}
              name='departamento'
              rules={[{ required: isColombia }]}
            >
              <SelectComponent
                options={l_departamentos}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                disabled={!isColombia}
                onChange={onChangeDepartamento}
              />
            </Form.Item>

            {isColombia ? (
              <Form.Item label='Ciudad de Residencia' initialValue={idBogota} name='ciudad' rules={[{ required: true }]}>
                <SelectComponent
                  options={l_municipios}
                  optionPropkey='idMunicipio'
                  optionPropLabel='descripcion'
                  onChange={onChangeMunicipio}
                />
              </Form.Item>
            ) : (
              <Form.Item label='Ciudad de Residencia' name='ciudad' rules={[{ required: true }]}>
                <Input allowClear placeholder='Ciudad' autoComplete='off' />
              </Form.Item>
            )}

            <Form.Item
              label='Localidad de Residencia'
              initialValue={idlocalidad}
              name='localidad'
              rules={[{ required: isBogota }]}
            >
              <SelectComponent
                options={l_localidades}
                optionPropkey='idLocalidad'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeLocalidad}
              />
            </Form.Item>

            <Form.Item label='Área de Residencia' initialValue={idupz} name='area' rules={[{ required: isBogota }]}>
              <SelectComponent
                options={l_areas}
                optionPropkey='idUpz'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeArea}
              />
            </Form.Item>

            <Form.Item label='Barrio de Residencia' initialValue={idbarrio} name='barrio' rules={[{ required: isBogota }]}>
              <SelectComponent options={l_barrios} optionPropkey='idBarrio' optionPropLabel='descripcion' disabled={!isBogota} />
            </Form.Item>
            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      'name',
                      'secondName',
                      'surname',
                      'secondSurname',
                      'nationalidad',
                      'IDType',
                      'IDNumber',
                      'pais',
                      'departamento',
                      'ciudad',
                      'localidad',
                      'area',
                      'barrio',
                      'civilStatus',
                      'educationLevel',
                      'etnia'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 2 && 'd-block'}`}>
            {tipoLicencia === 'Cremación' && <FamilarFetalCremacion tipoLicencia={tipoLicencia} />}

            <SolicitudInfoFormSeccion form={form} />

            <CementerioInfoFormSeccion form={form} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      ...KeyFormDeathInstitute,
                      ...KeyFormSolicitudInfo,
                      ...KeyFormCementerio,
                      'deathType',
                      'authIDType',
                      'authName',
                      'authSecondName',
                      'authSurname',
                      'authSecondSurname',
                      'authParentesco',
                      'authOtherParentesco'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 3 && 'd-block'}`}>
            <MedicalSignatureFormSeccion form={form} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='button' onClick={() => onNextStep([...KeyFormMedicalSignature])}>
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 4 && 'd-block'}`}>
            <DocumentosFormSeccion tipoLicencia={tipoLicencia} tipoIndividuo='Fetal' form={form} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='submit'>
                  Guardar
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
