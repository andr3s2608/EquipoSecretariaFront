// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { IndividualForm } from 'app/modules/licencia/components/form/individual.form';
import App from '../validarCovid/validar';

// Otros componentes
const { TabPane } = Tabs;

const InhumacionIndividualPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title='Licencia Inhumación - Individual'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />

      <Tabs>
        {/* <TabPane tab='Certificados' key='1'>
          <div className='card card-body py-5 mb-4 fadeInTop'>
            Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl
            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr,
            vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts
            beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui
            sapiente accusamus tattooed echo park.
          </div>
        </TabPane> */}
        <TabPane tab='Registro' key='1'>
          <IndividualForm tipoLicencia='Inhumación' tramite='a289c362-e576-4962-962b-1c208afa0273' />
          <App></App>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InhumacionIndividualPage;
