

--Crear Base de Datos
create Database ExamenDelCampoAsociados


--Tabla Proyecto---------------

CREATE TABLE [dbo].[Proyecto](
	[idProyecto] [int] IDENTITY(1,1) NOT NULL,
	[NombreProyecto] [varchar](50) NOT NULL,
	[Estatus] [bit] NOT NULL,
	[DuracionFechaInicio] [date] NULL,
	[DuracionFechaFin] [date] NULL,
 CONSTRAINT [PK_Proyecto] PRIMARY KEY CLUSTERED 
(
	[idProyecto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

--Tabla Empleados-----------------------------------------

CREATE TABLE [dbo].[Empleados](
	[idEmpleado] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[ApellidoPaterno] [varchar](50) NOT NULL,
	[ApellidoMaterno] [varchar](50) NOT NULL,
	[FechaNacimiento] [date] NOT NULL,
	[FechaAlta] [datetime] NOT NULL,
	[Sueldo] [numeric](10, 2) NOT NULL,
	[Estatus] [bit] NOT NULL,
	[Correo] [varchar](50) NOT NULL,
	[idProyecto] [int] NOT NULL,
 CONSTRAINT [PK_Empleados] PRIMARY KEY CLUSTERED 
(
	[idEmpleado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Empleados]  WITH CHECK ADD  CONSTRAINT [FK_Empleados_Proyecto] FOREIGN KEY([idProyecto])
REFERENCES [dbo].[Proyecto] ([idProyecto])
ON UPDATE CASCADE
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[Empleados] CHECK CONSTRAINT [FK_Empleados_Proyecto]
GO


--tabla Usuario----------------------------------------
CREATE TABLE [dbo].[Usuario](
	[idUsuario] [int] IDENTITY(1,1) NOT NULL,
	[NombreUsuario] [nvarchar](50) NOT NULL,
	[Contraseña] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[NombreUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

--insert de usuario Admin---------------------------------
insert into Usuario (NombreUsuario,Contraseña) values ('admin','123');


--------------EMPLEADOS

--Procedimiento Amacenado  sp_GetEmpleados--------------------------
CREATE PROCEDURE [dbo].[sp_GetEmpleados]
    @Nombre VARCHAR(50) = NULL,
    @ApellidoPaterno VARCHAR(50) = NULL,
    @ApellidoMaterno VARCHAR(50) = NULL,
    @EdadMin INT = NULL,
    @EdadMax INT = NULL,
    @idProyecto INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.idEmpleado,
        e.Nombre,
        e.ApellidoPaterno,
        e.ApellidoMaterno,
        e.FechaNacimiento,
        e.FechaAlta,
        e.Sueldo,
        e.Estatus,
        e.Correo,
        p.idProyecto,
        p.NombreProyecto
    FROM Empleados e
    LEFT JOIN Proyecto p ON e.idProyecto = p.idProyecto
    WHERE
        (@Nombre IS NULL OR e.Nombre LIKE '%' + @Nombre + '%')
        AND (@ApellidoPaterno IS NULL OR e.ApellidoPaterno LIKE '%' + @ApellidoPaterno + '%')
        AND (@ApellidoMaterno IS NULL OR e.ApellidoMaterno LIKE '%' + @ApellidoMaterno + '%')
        AND (@EdadMin IS NULL OR DATEDIFF(YEAR, e.FechaNacimiento, GETDATE()) >= @EdadMin)
        AND (@EdadMax IS NULL OR DATEDIFF(YEAR, e.FechaNacimiento, GETDATE()) <= @EdadMax)
        AND (@idProyecto IS NULL OR e.idProyecto = @idProyecto);
END


 
--Procedimiento almacenado sp_InsertEmpleado

CREATE PROCEDURE [dbo].[sp_InsertEmpleado]
    @Nombre VARCHAR(50),
    @ApellidoPaterno VARCHAR(50),
    @ApellidoMaterno VARCHAR(50),
    @FechaNacimiento DATE,
    @Sueldo NUMERIC(10,2),
    @Correo VARCHAR(50),
    @idProyecto INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar si ya existe el correo
    IF EXISTS (SELECT 1 FROM Empleados WHERE Correo = @Correo)
    BEGIN
        RAISERROR('Ya existe un empleado con este correo', 16, 1);
        RETURN;
    END

    -- Validar si ya existe el empleado con mismo nombre completo y correo
    --IF EXISTS (
       -- SELECT 1 FROM Empleados 
        --WHERE Nombre = @Nombre
         -- AND ApellidoMaterno = @ApellidoMaterno
         -- AND Correo = @Correo
   -- )
   -- BEGIN
        --RAISERROR('Ya existe un empleado con este nombre completo y correo', 16, 1);
        --RETURN;
    --END

    INSERT INTO Empleados
        (Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, FechaAlta, Sueldo, Estatus, Correo, idProyecto)
    VALUES
        (@Nombre, @ApellidoPaterno, @ApellidoMaterno, @FechaNacimiento, GETDATE(), @Sueldo, 1, @Correo, @idProyecto);

    SELECT SCOPE_IDENTITY() AS idEmpleado;
END

--Procediento Almacenado sp_UpdateEmpleado----------------------------------------
CREATE PROCEDURE [dbo].[sp_UpdateEmpleado]
    @idEmpleado INT,
    @Nombre VARCHAR(50),
    @ApellidoPaterno VARCHAR(50),
    @ApellidoMaterno VARCHAR(50),
    @FechaNacimiento DATE,
    @FechaAlta DATETIME,
    @Sueldo NUMERIC(10,2),
    @Estatus BIT,
    @Correo VARCHAR(50),
    @idProyecto INT
AS
BEGIN
    -- Validar si el correo ya existe en otro empleado
    IF EXISTS (
        SELECT 1
        FROM Empleados
        WHERE Correo = @Correo
          AND idEmpleado <> @idEmpleado
    )
    BEGIN
        RAISERROR('Ya existe un empleado con este correo', 16, 1);
        RETURN;
    END

    UPDATE Empleados
    SET Nombre = @Nombre,
        ApellidoPaterno = @ApellidoPaterno,
        ApellidoMaterno = @ApellidoMaterno,
        FechaNacimiento = @FechaNacimiento,
        FechaAlta = @FechaAlta,
        Sueldo = @Sueldo,
        Estatus = @Estatus,
        Correo = @Correo,
        idProyecto = @idProyecto
    WHERE idEmpleado = @idEmpleado;
END


--Procedimiento Almacenado  sp_DeleteEmpleado--------------------------------

CREATE PROCEDURE [dbo].[sp_DeleteEmpleado]
    @idEmpleado INT
AS
BEGIN
    DELETE FROM Empleados WHERE idEmpleado = @idEmpleado;
END

--Procedimiento Alamacenado sp_GetEmpleadoById-------------------------------
CREATE PROCEDURE [dbo].[sp_GetEmpleadoById]
    @idEmpleado INT
AS
BEGIN
    SELECT * FROM Empleados WHERE idEmpleado = @idEmpleado;
END

---------------------PROYECTOS---------------------------------

-------Procedimiento Almacenado  sp_GetProyectos
CREATE PROCEDURE [dbo].[sp_GetProyectos]
    @NombreProyecto NVARCHAR(100) = NULL,
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.idProyecto,
        p.NombreProyecto,
        p.DuracionFechaInicio,
        p.DuracionFechaFin,
        p.Estatus
    FROM Proyecto p
    WHERE 
        (@NombreProyecto IS NULL OR p.NombreProyecto LIKE '%' + @NombreProyecto + '%')
        AND (@FechaInicio IS NULL OR p.DuracionFechaInicio >= @FechaInicio)
        AND (@FechaFin IS NULL OR p.DuracionFechaFin <= @FechaFin);
END


---Procedimiento almacenado sp_InsertProyecto
CREATE PROCEDURE [dbo].[sp_InsertProyecto]
    @NombreProyecto VARCHAR(50),
    @Estatus BIT,
	@DuracionFechaInicio date,
	@DuracionFechaFin date
AS
BEGIN

 IF EXISTS (SELECT 1 FROM Proyecto WHERE NombreProyecto = @NombreProyecto)
 BEGIN
   RAISERROR('Ya existe un proyecto con ese nombre',16,1);
   return;
  end
    INSERT INTO Proyecto (NombreProyecto, Estatus,DuracionFechaInicio,DuracionFechaFin)
    VALUES (@NombreProyecto, @Estatus,@DuracionFechaInicio,@DuracionFechaFin);

    SELECT SCOPE_IDENTITY() AS idProyecto;
END

----Procedimiento Almacenado  sp_UpdateProyecto
CREATE PROCEDURE [dbo].[sp_UpdateProyecto]
    @idProyecto INT,
    @NombreProyecto VARCHAR(50),
    @Estatus BIT,
    @DuracionFechaInicio DATE,
    @DuracionFechaFin DATE
AS
BEGIN
    -- Solo validar si el nombre es distinto al actual
    IF EXISTS (
        SELECT 1 
        FROM Proyecto 
        WHERE NombreProyecto = @NombreProyecto 
          AND idProyecto <> @idProyecto
    )
    BEGIN
        RAISERROR('Ya existe un proyecto con ese nombre',16,1);
        RETURN;
    END

    UPDATE Proyecto
    SET NombreProyecto = @NombreProyecto,
        Estatus = @Estatus,
        DuracionFechaInicio = @DuracionFechaInicio,
        DuracionFechaFin = @DuracionFechaFin
    WHERE idProyecto = @idProyecto;
END


---Procedimeiento Almacenado  sp_DeleteProyecto

CREATE PROCEDURE [dbo].[sp_DeleteProyecto]
    @idProyecto INT
AS
BEGIN
    DELETE FROM Proyecto WHERE idProyecto = @idProyecto;
END


---Procedimiento Almacenado sp_GetProyectoById

CREATE PROCEDURE [dbo].[sp_GetProyectoById]
    @idProyecto INT
AS
BEGIN
    SELECT * FROM Proyecto WHERE idProyecto = @idProyecto;
END


------------------------REPORTES-----------------------

---Procedimiento Almacenado  sp_GetEmpleadosActivosReport
CREATE  PROCEDURE [dbo].[sp_GetEmpleadosActivosReport]
AS
BEGIN
SELECT 
    e.idEmpleado,
    e.Nombre,
    e.ApellidoPaterno,
    e.ApellidoMaterno,
    e.Correo,
    p.NombreProyecto
FROM Empleados e
LEFT JOIN Proyecto p ON e.idProyecto = p.idProyecto
WHERE e.Estatus = 1;
END;


---Procedimiento Almacenado sp_GetEmpleadosPorProyectoReport
CREATE  PROCEDURE [dbo].[sp_GetEmpleadosPorProyectoReport]
AS
BEGIN
    SELECT 
        p.NombreProyecto,
        e.idEmpleado,
        e.Nombre + ' ' + e.ApellidoPaterno + ' ' + e.ApellidoMaterno AS NombreCompleto,
        e.Correo
    FROM Proyecto p
    LEFT JOIN Empleados e 
        ON p.idProyecto = e.idProyecto 
       AND e.Estatus = 1
    ORDER BY p.NombreProyecto, NombreCompleto;
END;

 
--Procedimiento Almacenado  sp_GetProyectosActivosReport
CREATE PROCEDURE [dbo].[sp_GetProyectosActivosReport]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        NombreProyecto,
        DuracionFechaInicio,
        DuracionFechaFin
    FROM Proyecto
    WHERE Estatus = 1;
END

 ------------Usuario--------------------

--- Procedimiento Almacenado sp_GetUsuarioPorNombre

CREATE PROCEDURE [dbo].[sp_GetUsuarioPorNombre]
    @nombreUsuario NVARCHAR(50),
    @password NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        idUsuario,
        nombreUsuario,
        Contraseña
    FROM Usuario
    WHERE nombreUsuario = @nombreUsuario
      AND Contraseña = @password; 
END
