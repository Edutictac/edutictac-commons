class BankError(Exception):
    """Error de banco con código estable (la interfaz lo traduce) y estado HTTP."""

    def __init__(self, status: int, code: str):
        super().__init__(code)
        self.status, self.code = status, code
