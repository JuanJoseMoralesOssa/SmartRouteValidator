// Solo en un caso muy específico: cuando haya una operación compuesta que involucra lógica coordinada entre ambas entidades.

// Por ejemplo:
// Crear una ruta y registrar ciudades nuevas si no existen.

// O validar que una ciudad pertenece a una región antes de permitir una ruta.

// Ahí puedes tener un servicio orquestador o un controlador específico como RouteCreationController, que use internamente los servicios de City y Route, pero sin fusionarlos.
