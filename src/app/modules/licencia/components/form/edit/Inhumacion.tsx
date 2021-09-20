export const EditInhumacion = () => {

    const data = localStorage.getItem('register');

    if (data) {
        const json = JSON.parse(data);
        const [obj] = json;
        return formatObjJson(obj);
    }
    return {
        isLugar: () => {
            return 'Dentro de Bogotá';
        }
    };

};

const formatObjJson = (obj: any) => {

    const { institucionCertificaFallecimiento, lugarDefuncion, persona, ubicacionPersona, datosCementerio } = obj;
    const [fallecido, certicador] = persona;
    const jsonDt = {
        idTramite: obj.idTramite,
        certificado: obj.numeroCertificado,
        date: obj.fechaDefuncion,
        time: obj.hora,
        check: obj.sinEstablecer,
        sex: obj.idSexo,

        country: lugarDefuncion.idPais,
        state: lugarDefuncion.idDepartamento,
        city: lugarDefuncion.idMunicipio,
        areaDef: lugarDefuncion.idAreaDefuncion,
        sitDef: lugarDefuncion.idSitioDefuncion,

        instType: institucionCertificaFallecimiento.idTipoInstitucion,
        instTipoIdent: institucionCertificaFallecimiento.tipoIdentificacion,
        instNumIdent: institucionCertificaFallecimiento.numeroIdentificacion,
        instRazonSocial: institucionCertificaFallecimiento.razonSocial,
        instNumProtocolo: institucionCertificaFallecimiento.numeroProtocolo,
        instNumActaLevantamiento: institucionCertificaFallecimiento.numeroActaLevantamiento,
        instFechaActa: institucionCertificaFallecimiento.fechaActa,
        instSeccionalFiscalia: institucionCertificaFallecimiento.seccionalFiscalia,
        instNoFiscal: institucionCertificaFallecimiento.noFiscal,

        name: fallecido.primerNombre,
        secondName: fallecido.segundoNombre,
        surname: fallecido.primerApellido,
        secondSurname: fallecido.segundoApellido,
        nationalidad: [fallecido.nacionalidad],
        dateOfBirth: fallecido.fechaNacimiento,
        IDType: fallecido.tipoIdentificacion,
        IDNumber: fallecido.numeroIdentificacion,
        civilStatus: fallecido.idEstadoCivil,
        educationLevel: fallecido.idNivelEducativo,
        etnia: fallecido.idEtnia,
        regime: fallecido.idRegimen, //falta
        deathType: fallecido.idTipoMuerte,

        residencia: ubicacionPersona.idPaisResidencia,
        idDepartamentoResidencia: ubicacionPersona.idDepartamentoResidencia,
        idCiudadResidencia: ubicacionPersona.idCiudadResidencia,
        idLocalidadResidencia: ubicacionPersona.idLocalidadResidencia,
        idAreaResidencia: ubicacionPersona.idAreaResidencia,
        idBarrioResidencia: ubicacionPersona.idBarrioResidencia,

        cementerioLugar: datosCementerio.cementerio,
        cementerioBogota: datosCementerio.cementerio,
        cementerioDepartamento: datosCementerio.idDepartamento,
        cementerioMunicipio: datosCementerio.idMunicipio,
        cementerioPais: datosCementerio.idPais,
        cementerioCiudad: datosCementerio.ciudad,
        otro: datosCementerio.otroSitio,

        medicalSignatureIDType: certicador.tipoIdentificacion,
        medicalSignatureIDNumber: certicador.numeroIdentificacion,
        medicalSignatureIDExpedition: certicador.idLugarExpedicion,
        medicalSignatureName: certicador.primerNombre,
        medicalSignatureSecondName: certicador.segundoNombre,
        medicalSignatureSurname: certicador.primerApellido,
        medicalSignatureSecondSurname: certicador.segundoApellido,
        medicalSignatureProfesionalType: certicador.idTipoProfesional,

        isLugar: () => {
            const { enBogota, fueraBogota, fueraPais } = datosCementerio;
            let value: string = '';
            if (enBogota) {
                value = "Dentro de Bogotá";
            }
            if (fueraBogota) {
                value = "Fuera de Bogotá";
            }
            if (fueraPais) {
                value = "Fuera del País";
            }
            return value;
        }

    };
    return jsonDt;

}