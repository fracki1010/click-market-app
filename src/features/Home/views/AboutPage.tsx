import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Divider, Button } from "@heroui/react";
import {
  FaHandHoldingHeart,
  FaUsers,
  FaRocket,
  FaStore,
  FaArrowRight,
} from "react-icons/fa6";
import { Link } from "react-router";

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-16"
    >
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div variants={itemVariants}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Nuestra Historia
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-default-900 tracking-tight leading-tight">
            Click Market: <br />
            <span className="text-primary">Tu súper del barrio, hoy.</span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-lg text-default-600 leading-relaxed max-w-2xl mx-auto"
        >
          Nacimos con la idea de simplificar el día a día de nuestros vecinos.
          Queremos que pases menos tiempo en la góndola y más tiempo disfrutando
          de lo que te gusta.
        </motion.p>
      </section>

      {/* Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full border-none shadow-xl bg-content1">
            <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary text-3xl flex items-center justify-center">
                <FaHandHoldingHeart />
              </div>
              <h3 className="text-xl font-bold text-default-900">
                Calidad Humana
              </h3>
              <p className="text-sm text-default-500">
                Cada pedido es preparado con el mismo cuidado que si lo
                eligieras vos mismo.
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-none shadow-xl bg-content1">
            <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary text-3xl flex items-center justify-center">
                <FaRocket />
              </div>
              <h3 className="text-xl font-bold text-default-900">
                Rapidez Real
              </h3>
              <p className="text-sm text-default-500">
                Entendemos el valor de tu tiempo. En tan solo 48 horas, podras disfrutar de tu pedido.
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-none shadow-xl bg-content1">
            <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary text-3xl flex items-center justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold text-default-900">Comunidad</h3>
              <p className="text-sm text-default-500">
                No somos solo una app, somos parte de tu barrio y apoyamos el
                comercio local.
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="bg-default-50 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
              alt="Almacen local"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 space-y-6">
            <h2 className="text-3xl font-black text-default-900 tracking-tight">
              Cómo empezó todo
            </h2>
            <Divider className="w-12 h-1 bg-primary rounded-full transition-all" />
            <p className="text-default-600 leading-relaxed">
              Click Market comenzó como un pequeño proyecto familiar en 2024. Al
              ver la necesidad de una forma más ágil de acceder a los productos
              esenciales del día a día, decidimos crear una plataforma que
              combinara la cercanía de un almacén amigo con la tecnología
              moderna.
            </p>
            <p className="text-default-600 leading-relaxed">
              Hoy, seguimos creciendo de la mano de nuestros clientes,
              incorporando cada vez más variedad y optimizando cada paso de
              nuestra logística para seguir siendo tu opción número uno.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center pt-8">
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex justify-center gap-12 text-default-300">
            <FaStore size={40} />
            <FaStore size={40} />
            <FaStore size={40} />
          </div>
          <h2 className="text-2xl font-bold text-default-900">
            ¿Tenes alguna consulta o querés conocernos mejor?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/products"
              className="bg-primary text-white font-bold h-12 px-8 shadow-lg shadow-primary/20"
              radius="full"
              endContent={<FaArrowRight />}
            >
              Ir a la tienda
            </Button>
            <Button
              className="bg-content1 text-primary border-2 border-divider font-bold h-12 px-8"
              radius="full"
              href="https://wa.me/2622517447?text=Hola%20buenas,%20tenia%20una%20duda"
              as="a"
              target="_blank"
            >
              Contactanos
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};
