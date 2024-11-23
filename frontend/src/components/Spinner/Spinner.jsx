// Spinner.jsx
import { motion } from "framer-motion";
import { AiOutlineLoading } from "react-icons/ai";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <motion.div
                className="text-Primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <AiOutlineLoading style={{width:'50', height:'50'}} />
            </motion.div>
        </div>
    );
};

export default Spinner;
