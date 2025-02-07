import { Link } from 'react-router';

const Home = () => {
    return (
        <div>
            <h2 className='font-semibold text-2xl'>Home Page</h2>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
};

export default Home;