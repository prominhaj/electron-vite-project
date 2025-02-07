import { Link } from 'react-router';

const Home = () => {
    return (
        <div>
            Home Page
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
};

export default Home;