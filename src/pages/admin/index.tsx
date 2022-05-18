import Layout from "@/Layout";
import HomePage from "@/containers/Home";

const Home = () => (
	<Layout is_admin={false} title="Unifoam Human Resource Management - Admin">
		<HomePage />
	</Layout>
)

export default Home;