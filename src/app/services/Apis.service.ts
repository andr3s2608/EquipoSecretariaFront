import { environments } from '../../environments/environments';
import { get, post, put } from './settings/http.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IResponse } from 'app/Models/IResponse';
import { IRoles } from 'app/Models/IRoles';
import { Menu } from 'app/Models/IMenu';
import { IEstadoSolicitud } from 'app/Models/IEstadoSolicitud';
import { IinformatioUser } from 'app/Models/IInformatioUser';
import { Iformato } from 'app/Models/IFormato';

export class ApiService {
  endpoint = environments.shared;
  private oid = '';

  constructor(oid$: string) {
    this.oid = oid$;
  }

  personaNatural = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: environments.shared, url: `v2/Persona/AddPersonaNatural`, payload: tipoDominio, id: '0' });

  personaJuridica = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `v2/Persona/AddPersonaJuridica`, payload: tipoDominio, id: '0' });

  GetMenuUser = () => get<Menu[]>({ endpoint: environments.security, url: `Security/GetMenuByUser/${this.oid}`, id: '0' });

  GetRoles = () => get<IRoles[]>({ endpoint: environments.security, url: `Security/GetRoleByIdUser/${this.oid}`, id: '0' });

  AddUser = (payload: any) =>
    post<any>({ endpoint: environments.security, url: `Security/AddUser`, payload, confirmModal: false, id: '0' });

  PostRolesUser = (payload: any) =>
    post({ endpoint: environments.security, url: 'Security/AddUserRole', payload, confirmModal: false, id: '0' });

  GetSexo = () => get<[]>({ endpoint: environments.shared, url: 'v1/Sexo/GetSexo', id: '0' });

  GetEtnia = () => get<[]>({ endpoint: environments.shared, url: 'v1/Etnia/GetEtnia', id: '0' });

  getTipoDocumeto = () => get<[]>({ endpoint: environments.shared, url: 'v1/TipoIdentificacion/GetTipoIdentificacion', id: '0' });

  getPaises = () => get<[]>({ endpoint: environments.shared, url: 'v1/Pais/GetPais', id: '0' });

  getDepartament = () => get<[]>({ endpoint: environments.shared, url: 'v1/Departamento/GetDepartamento', id: '0' });

  getMunicipio = (id: string) =>
    get<[]>({ endpoint: environments.shared, url: `v1/Municipio/GetMunicipioByIdDepartamento/${id}`, id: '0' });

  GetNivelEducativo = () => get<[]>({ endpoint: environments.shared, url: 'v1/NivelEducativo/GetNivelEducativo', id: '0' });

  getCertificado = (solicitud: string) =>
    get<any>({
      endpoint: environments.endpointV1,
      url: `CertificadoDefuncion/ValidateCertificadoDefuncion/73051461`,
      id: '0'
    });

  getMedico = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: `ProfesionalesSalud/GetProfesionalSaludByNumeroIdentificacion/86073058564`,
      id: '0'
    });

  GetAllcementerios = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: 'Cementerio/GetAllCementerio',
      id: '0'
    });

  GetFunerarias = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: 'Funeraria/GetAllFuneraria',
      id: '0'
    });

  postLicencia = (payload: any) => post({ endpoint: environments.inhcremacion, url: 'Request/AddRquest', payload, id: '0' });

  postprueba = (payload: any) => post({ endpoint: environments.local, url: 'Request/AddRquest', payload, id: '0' });

  AddGestion = (payload: any, id: string) => post({ endpoint: environments.local, url: 'Request/AddGestion', payload, id });

  putLicencia = (payload: any) => put({ endpoint: environments.inhcremacion, url: 'Request/UpdateRequest', payload, id: '0' });

  uploadFiles = (payload: any) =>
    post({
      endpoint: environments.blob,
      url: `Storage/AddFile`,
      payload,
      id: '0',
      options: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      confirmModal: false
    });

  GetEstadoSolicitud = () =>
    get<[]>({ endpoint: environments.inhcremacion, url: `Request/GetRequestByIdUser/${this.oid}`, id: '0' });

  GetResumenSolicitud = (solicitud: string) =>
    get<any>({ endpoint: environments.local, url: `Request/GetResumenSolicitud/${solicitud}`, id: '0' });
  GetFunerariasAzure = (solicitud: string) =>
    get<any>({ endpoint: environments.local, url: `Request/GetFunerariabyidSolicitud/${solicitud}`, id: '0' });

  getallbyEstado = (solicitud: string) =>
    get<[]>({ endpoint: environments.local, url: `Request/GetRequestByIdEstado/${solicitud}`, id: '0' });

  AddSupportDocuments = (payload: any[]) =>
    post({
      endpoint: environments.inhcremacion,
      url: 'SupportDocuments/AddSupportDocuments',
      payload,
      confirmModal: false,
      id: '0'
    });
  UpdateSupportDocuments = (payload: any[]) =>
    put({
      endpoint: environments.inhcremacion,
      url: 'SupportDocuments/UpdateSuport',
      payload,
      confirmModal: false,
      id: '0'
    });

  getSupportDocuments = (solicitud: string) =>
    get<any>({ endpoint: environments.inhcremacion, url: `SupportDocuments/GetAllSuportByRequestId/${solicitud}`, id: '0' });

  GetInformationUser = (userId: string) =>
    get<IinformatioUser>({ endpoint: environments.shared, url: `v2/Persona/GetInfoUserById/${userId}`, id: '0' });

  GetAllLicencias = () =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: 'Request/GetAllRequest',
      id: '0'
    });

  getCodeUser = () =>
    get<any>({ endpoint: environments.security, url: `Security/GetCodeVentanillaByIdUser/${this.oid}`, id: '0' });

  getLicencia = (solicitud: string) =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: `Request/GetRequestById/${solicitud}`,
      id: '0'
    });

  //https://wa-aeu-sds-dev-tsecurity.azurewebsites.net/api/v2/Security/UpdateUser
  putUser = (payload: any) => put<any>({ endpoint: environments.security, url: 'Security/UpdateUser', payload, id: '0' });

  UpdataLicencia = () => {};
  GetAllTypeValidation = () =>
    get<[]>({
      endpoint: environments.endpointV1,
      url: `Dominio/GetAllDominio/C5D41A74-09B6-4A7C-A45D-42792FCB4AC2`,
      id: '0'
    });

  addSeguimiento = (payload: any) => {
    return post<any>({
      endpoint: environments.inhcremacion,
      url: 'Seguimiento/AddSeguimiento',
      payload,
      id: '0'
    });
  };

  getUserTramite = (idTramite: string) =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: `Seguimiento/GetSeguimientoBySolicitud/${idTramite}`,
      id: '0'
    });

  GeneratePDF = (idTramite: string) => window.open(`${environments.local}GeneratePDF/GeneratePDF/${idTramite}`, 'descarga');

  getLinkPDF = (idTramite: string): string => {
    return environments.local + 'GeneratePDF/GeneratePDF/' + idTramite;
  };

  GetSolicitud = (solicitud: string) =>
    get<any>({
      endpoint: environments.local,
      url: `Request/GetAllRequestByIdSolicitud/${solicitud}`,
      id: '0'
    });

  sendEmail = (payload: any) => {
    return post<any>({
      endpoint: environments.notificacion,
      url: 'Email/SendMail',
      payload,
      id: '1'
    });
  };

  getFormato = (idPlantilla: string) =>
    get<Iformato>({
      endpoint: environments.formatos,
      url: `GetFormatoByTipoPlantilla/${idPlantilla}`,
      id: '0'
    });
}
