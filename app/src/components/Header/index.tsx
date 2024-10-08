import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header(): React.ReactNode {
    return (
        <header className="flex justify-between items-center p-6 bg-card">
            <div className="flex items-center space-x-8">
                <div className="text-primary font-bold text-2xl">
                    AlgoQuiz
                </div>
                <nav className="flex space-x-6">
                    <Link to="/" className="text-primary font-semibold">
                        Home
                    </Link>
                    <Link to="/algoritmos" className="text-muted-foreground">
                        Algoritmos
                    </Link>
                    <Link to="/quizz" className="text-muted-foreground">
                        Quizz
                    </Link>
                    <Link to="/sobre" className="text-muted-foreground">
                        Sobre
                    </Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <Bell className="text-muted-foreground" />
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                    <span className="text-sm">Nome do Usuário</span>
                </div>
            </div>
        </header>
    );
}