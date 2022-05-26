import { Helmet } from 'react-helmet-async';

function PageTitle({ title }: { title: string }) {
  return <Helmet title={`Market | ${title}`} />;
}

export default PageTitle;
