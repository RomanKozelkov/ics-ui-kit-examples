import type { ApiGroup, HttpMethod } from "./types";

export const API_DATA: ApiGroup[] = [
	{
		tag: "users",
		description: "Операции с пользователями",
		endpoints: [
			{
				method: "GET",
				path: "/users",
				summary: "Получить список пользователей",
				description: "Возвращает список всех пользователей с поддержкой фильтрации по роли и пагинации.",
				parameters: [
					{
						name: "page",
						type: "integer",
						location: "query",
						description: "Номер страницы",
						defaultValue: 1,
						placeholder: "1"
					},
					{
						name: "limit",
						type: "integer",
						location: "query",
						description: "Количество элементов на странице",
						defaultValue: 20,
						placeholder: "20"
					},
					{
						name: "role",
						type: "string",
						location: "query",
						description: "Фильтр по роли пользователя",
						options: [
							{ value: "", label: "Любая роль" },
							{ value: "admin", label: "admin" },
							{ value: "user", label: "user" },
							{ value: "moderator", label: "moderator" }
						]
					}
				],
				responses: [
					{
						code: 200,
						description: "Успешный ответ",
						contentTypes: ["application/json"],
						acceptHelper: true,
						examples: [
							{
								label: "Список пользователей",
								json: JSON.stringify(
									{
										total: 2,
										page: 1,
										limit: 20,
										data: [
											{ id: 1, name: "Иван Иванов", email: "ivan@example.com", role: "admin" },
											{ id: 2, name: "Мария Петрова", email: "maria@example.com", role: "user" }
										]
									},
									null,
									2
								)
							},
							{
								label: "Пустая выборка",
								json: JSON.stringify({ total: 0, page: 1, limit: 20, data: [] }, null, 2)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "total", type: "integer" },
								{ name: "page", type: "integer" },
								{ name: "limit", type: "integer" },
								{ name: "data", type: "array[User]" }
							]
						}
					},
					{
						code: 401,
						description: "Не авторизован"
					},
					{
						code: 403,
						description: "Доступ запрещён"
					}
				]
			},
			{
				method: "POST",
				path: "/users",
				summary: "Создать пользователя",
				description: "Создаёт нового пользователя в системе.",
				parameters: [],
				requestBody: {
					contentType: "application/json",
					example: JSON.stringify(
						{ name: "Иван Иванов", email: "ivan@example.com", role: "user", password: "secret" },
						null,
						2
					)
				},
				responses: [
					{
						code: 201,
						description: "Пользователь создан",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Созданный пользователь",
								json: JSON.stringify(
									{ id: 42, name: "Иван Иванов", email: "ivan@example.com", role: "user" },
									null,
									2
								)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "id", type: "integer" },
								{ name: "name", type: "string" },
								{ name: "email", type: "string" },
								{ name: "role", type: "string" }
							]
						}
					},
					{
						code: 400,
						description: "Некорректные данные"
					},
					{
						code: 409,
						description: "Email уже существует"
					}
				]
			},
			{
				method: "GET",
				path: "/users/{userId}",
				summary: "Получить пользователя",
				description: "Возвращает данные конкретного пользователя по его идентификатору.",
				parameters: [
					{
						name: "userId",
						type: "integer",
						location: "path",
						description: "Идентификатор пользователя",
						required: true,
						placeholder: "1"
					}
				],
				responses: [
					{
						code: 200,
						description: "Данные пользователя",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Пользователь",
								json: JSON.stringify(
									{ id: 1, name: "Иван Иванов", email: "ivan@example.com", role: "admin" },
									null,
									2
								)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "id", type: "integer" },
								{ name: "name", type: "string" },
								{ name: "email", type: "string" },
								{ name: "role", type: "string" }
							]
						}
					},
					{
						code: 401,
						description: "Не авторизован"
					},
					{
						code: 404,
						description: "Пользователь не найден"
					}
				]
			},
			{
				method: "DELETE",
				path: "/users/{userId}",
				summary: "Удалить пользователя",
				description: "Удаляет пользователя по идентификатору. Операция необратима.",
				authLocked: true,
				parameters: [
					{
						name: "userId",
						type: "integer",
						location: "path",
						description: "Идентификатор пользователя",
						required: true,
						placeholder: "1"
					}
				],
				responses: [
					{
						code: 204,
						description: "Пользователь удалён"
					},
					{
						code: 401,
						description: "Не авторизован"
					},
					{
						code: 404,
						description: "Пользователь не найден"
					}
				]
			}
		]
	},
	{
		tag: "auth",
		description: "Аутентификация и токены",
		endpoints: [
			{
				method: "POST",
				path: "/auth/login",
				summary: "Войти в систему",
				description: "Аутентифицирует пользователя и возвращает пару токенов доступа.",
				parameters: [],
				requestBody: {
					contentType: "application/json",
					example: JSON.stringify({ email: "ivan@example.com", password: "secret" }, null, 2)
				},
				responses: [
					{
						code: 200,
						description: "Успешная аутентификация",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Токены",
								json: JSON.stringify(
									{
										accessToken: "eyJhbGci...",
										refreshToken: "dGhpcyBp...",
										expiresIn: 3600
									},
									null,
									2
								)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "accessToken", type: "string" },
								{ name: "refreshToken", type: "string" },
								{ name: "expiresIn", type: "integer" }
							]
						}
					},
					{
						code: 400,
						description: "Некорректные данные"
					},
					{
						code: 401,
						description: "Неверные учётные данные"
					}
				]
			},
			{
				method: "POST",
				path: "/auth/refresh",
				summary: "Обновить токен",
				description: "Обновляет пару токенов по действующему refresh-токену.",
				parameters: [],
				requestBody: {
					contentType: "application/json",
					example: JSON.stringify({ refreshToken: "dGhpcyBp..." }, null, 2)
				},
				responses: [
					{
						code: 200,
						description: "Новая пара токенов",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Обновлённые токены",
								json: JSON.stringify(
									{
										accessToken: "eyJuZXci...",
										refreshToken: "bmV3UmVm...",
										expiresIn: 3600
									},
									null,
									2
								)
							}
						]
					},
					{
						code: 401,
						description: "Недействительный refresh-токен"
					}
				]
			}
		]
	},
	{
		tag: "products",
		description: "Каталог товаров",
		endpoints: [
			{
				method: "GET",
				path: "/products",
				summary: "Список товаров",
				description: "Возвращает каталог товаров с фильтрацией по категории и пагинацией.",
				parameters: [
					{
						name: "page",
						type: "integer",
						location: "query",
						description: "Номер страницы",
						defaultValue: 1,
						placeholder: "1"
					},
					{
						name: "limit",
						type: "integer",
						location: "query",
						description: "Количество элементов на странице",
						defaultValue: 20,
						placeholder: "20"
					},
					{
						name: "category",
						type: "string",
						location: "query",
						description: "Фильтр по категории",
						options: [
							{ value: "", label: "Все категории" },
							{ value: "electronics", label: "Электроника" },
							{ value: "clothing", label: "Одежда" },
							{ value: "food", label: "Еда" }
						]
					}
				],
				responses: [
					{
						code: 200,
						description: "Список товаров",
						contentTypes: ["application/json"],
						acceptHelper: true,
						examples: [
							{
								label: "Каталог",
								json: JSON.stringify(
									{
										total: 2,
										page: 1,
										limit: 20,
										data: [
											{ id: 1, name: "Ноутбук Pro", category: "electronics", price: 89990 },
											{ id: 2, name: "Футболка", category: "clothing", price: 1490 }
										]
									},
									null,
									2
								)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "total", type: "integer" },
								{ name: "page", type: "integer" },
								{ name: "data", type: "array[Product]" }
							]
						}
					}
				]
			},
			{
				method: "POST",
				path: "/products",
				summary: "Добавить товар",
				description: "Создаёт новый товар в каталоге.",
				authLocked: true,
				parameters: [],
				requestBody: {
					contentType: "application/json",
					example: JSON.stringify(
						{ name: "Ноутбук Pro", category: "electronics", price: 89990, stock: 15 },
						null,
						2
					)
				},
				responses: [
					{
						code: 201,
						description: "Товар создан",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Созданный товар",
								json: JSON.stringify(
									{ id: 100, name: "Ноутбук Pro", category: "electronics", price: 89990, stock: 15 },
									null,
									2
								)
							}
						]
					},
					{
						code: 400,
						description: "Некорректные данные"
					},
					{
						code: 401,
						description: "Не авторизован"
					}
				]
			},
			{
				method: "GET",
				path: "/products/{productId}",
				summary: "Получить товар",
				description: "Возвращает данные конкретного товара по его идентификатору.",
				parameters: [
					{
						name: "productId",
						type: "integer",
						location: "path",
						description: "Идентификатор товара",
						required: true,
						placeholder: "1"
					}
				],
				responses: [
					{
						code: 200,
						description: "Данные товара",
						contentTypes: ["application/json"],
						examples: [
							{
								label: "Товар",
								json: JSON.stringify(
									{ id: 1, name: "Ноутбук Pro", category: "electronics", price: 89990, stock: 15 },
									null,
									2
								)
							}
						],
						schema: {
							type: "object",
							fields: [
								{ name: "id", type: "integer" },
								{ name: "name", type: "string" },
								{ name: "category", type: "string" },
								{ name: "price", type: "number" },
								{ name: "stock", type: "integer" }
							]
						}
					},
					{
						code: 404,
						description: "Товар не найден"
					}
				]
			}
		]
	}
];
