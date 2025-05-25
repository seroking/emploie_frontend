import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { loginUser } from '../services/authService';
import LoginImg from '../assets/images/LoginImage.png';
import betterLogo from '../assets/images/betterLogo.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user, token } = await loginUser(email, password);

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User logged in:', user);
      setUser(user);

      const allowedRoles = [
        "DirecteurEtablissement",
        "DirecteurSuper",
        "DirecteurRegional",
        "DirecteurComplexe"
      ];

      if (allowedRoles.includes(user.role)) {
        navigate('/dashboard'); // or '/calendar' or any default page
      } else {
        navigate('/unauthorized');
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-gray-200">
        <img
          src={LoginImg}
          alt="Decorative background"
          className="absolute h-full w-full object-cover"
          style={{ objectPosition: '10% center' }}
        />
        <div className="absolute top-[28px] left-8">
          <img src={betterLogo} alt="Company Logo" className="w-32 h-auto" />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-bold text-black mb-4">LOGIN</h1>
            <div className="h-[1px] w-16 bg-black mx-auto mb-4"></div>
            <p className="text-black text-[16px]">Lorem ipsum dolor sit amet</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              {error && (
                <div className="text-red-500 text-sm mt-1 text-center">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isLoading ? 'opacity-75' : ''}`}
              style={{
                background: 'linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)',
                boxShadow: '0 4px 15px rgba(72, 52, 205, 0.4)'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Login Now'
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">OFFPT</p>
            <p className="text-sm text-gray-600 mt-2">LOOM</p>
            <a href="http://www.legendmotorcycle.com/about/90" className="text-sm text-blue-600 hover:underline mt-1 block">
              www.legendmotorcycle.com/about/90
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
