import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


interface NavItemProps {
    path: string;
    label: string;
    icon: React.ComponentType<{ size?: number, color?: string }>;
    isActive: boolean;
    isHover: boolean;
    setIsHover: React.Dispatch<React.SetStateAction<string | null>>;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, icon: Icon, isActive, isHover, setIsHover }) => {
    return (
        <li
            className="relative"
            onMouseEnter={() => setIsHover(label)}
            onMouseLeave={() => setIsHover(null)}
        >
            <Link
                to={path}
                className={`py-2 relative duration-300 transition-colors hover:!text-gray-800 flex items-center space-x-2 ${isActive ? '!text-gray-800' : 'text-gray-600'}`}
                style={{ color: isActive ? "#374151" : "#6B7280" }}
                aria-label={`Go to ${label} page`}
            >
                <Icon size={20} color={isActive ? "#374151" : "#6B7280"} />
                <span className="hidden sm:inline-block">{label}</span>
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800 origin-bottom-left"
                    style={{
                        zIndex: -1,
                        borderRadius: '99px', 
                    }}
                    layoutId="underline" 
                    initial={false}
                    animate={{
                        scaleX: (isActive || isHover) ? 1 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.2,
                    }}
                />
            </Link>
        </li>
    );
};

export default NavItem;