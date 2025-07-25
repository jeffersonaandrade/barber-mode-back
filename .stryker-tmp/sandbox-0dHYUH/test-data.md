# Dados de Teste - Lucas Barbearia

## Usuário Admin Criado

### Resposta do Endpoint de Registro
```json
{
    "success": true,
    "message": "Usuário criado com sucesso",
    "data": {
        "id": "8d01bfc1-b9cf-4046-be4b-7b1c9197db42",
        "email": "admin@lucasbarbearia.com",
        "role": "admin",
        "nome": "Administrador",
        "telefone": "(11) 99999-9999",
        "created_at": "2025-07-23T21:56:41.156527+00:00",
        "updated_at": "2025-07-23T21:56:41.156527+00:00",
        "active": true
    }
}
```

### Dados do Usuário
- **ID:** `8d01bfc1-b9cf-4046-be4b-7b1c9197db42`
- **Email:** `admin@lucasbarbearia.com`
- **Role:** `admin`
- **Nome:** `Administrador`
- **Telefone:** `(11) 99999-9999`
- **Status:** `active`
- **Data de Criação:** `2025-07-23T21:56:41.156527+00:00`

### Credenciais de Login
- **Email:** `admin@lucasbarbearia.com`
- **Senha:** `admin123`

### Endpoints para Teste
- **Registro:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Dados do Usuário:** `GET /api/auth/me`
- **Logout:** `POST /api/auth/logout` 