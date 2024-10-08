import { NavLink } from 'react-router-dom';

export function Header(): React.ReactNode {
    return (
        <header className="flex justify-between items-center p-6 bg-card">
            <div className="flex items-center space-x-8">
                <div className="text-primary font-bold text-2xl">
                    AlgoQuiz
                </div>
                <nav className="flex space-x-6">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/algoritmos" 
                        className={({ isActive }) => 
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }
                    >
                        Algoritmos
                    </NavLink>
                    <NavLink 
                        to="/quizz" 
                        className={({ isActive }) => 
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }
                    >
                        Quizz
                    </NavLink>
                    <NavLink 
                        to="/sobre" 
                        className={({ isActive }) => 
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }
                    >
                        Sobre
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}