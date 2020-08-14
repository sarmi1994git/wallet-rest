const { required, maxLength, minLength, isNumber, validEmail } = require('../validations/validations');
const config = require('../config');
const soap = require('soap');

const createUser = async (req, res) => {
	try {
		const { identification, firstname, lastname, email, phone } = req.body;
		const validate = validateInputs({ identification, firstname, lastname, email, phone });
		if (validate.code === 0) {
			const user = { identification, firstname, lastname, email, phone };
			soap.createClientAsync(config.urlWsdl, {disableCache: true}).then((client) => {
				//console.log(client);
				return client.createUserAsync(user);
			}).then((result) => {
				const response = result[0];
				if (response && response.response) {
					response.response.code['$value']
					const data = response.response;
					if (Number(data.code['$value']) === 0) {
						return res.status(201).json({
							code: 0,
							message: 'Usuario creado con éxito'
						});
					} else {
						return res.status(200).json({
							code: 1,
							message: data.message['$value']
						});
					}
				} else {
					var errmess = new Error('Problemas al crear el usuario, intente más tarde');
					throw errmess;
				}
			}).catch(error => {
				console.log(error);
				return res.status(500).json({
							code: 1,
							message: 'Error al crear usuario: ' + error.message
						});
			});

		} else {
			res.status(400).json({
				code: 1,
				message: validate.message
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al crear usuario: ' + e.message
		});
	}
}

const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar campo identification
	if (!required(inputs.identification)) {
		response.code = 1;
		response.message = "La identificación es requerida";
		return response;
	}
	if (!minLength(10, inputs.identification)) {
		response.code = 1;
		response.message = "La identificación debe tener al menos 10 caracteres";
		return response;
	}
	if (!maxLength(15, inputs.identification)) {
		response.code = 1;
		response.message = "La identificación debe tener 15 caracteres o menos";
		return response;
	}
	//Validar de campo firstname (requerido, minLength y maxLength)
	if (!required(inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre es requerido";
		return response;
	}
	if (!minLength(3, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener 20 caracteres o menos";
		return response;
	}
	//Validar de campo lastname (requerido, minLength y maxLength)
	if (!required(inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido es requerido";
		return response;
	}
	if (!minLength(3, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener 20 caracteres o menos";
		return response;
	}
	
	//Validar de campo email (requerido, validEmail)
	if (!required(inputs.email)) {
		response.code = 1;
		response.message = "El email es requerido";
		return response;
	}
	if (!validEmail(inputs.email)) {
		response.code = 1;
		response.message = "Dirección de email inválida";
		return response;
	}

	//Validar campo phone
	if (!required(inputs.phone)) {
		response.code = 1;
		response.message = "El teléfono es requerido";
		return response;
	}
	if (!minLength(10, inputs.phone)) {
		response.code = 1;
		response.message = "El teléfono debe tener al menos 10 caracteres";
		return response;
	}
	if (!maxLength(15, inputs.phone)) {
		response.code = 1;
		response.message = "El teléfono debe tener 15 caracteres o menos";
		return response;
	}
	return response;
}

module.exports = {
	createUser
}