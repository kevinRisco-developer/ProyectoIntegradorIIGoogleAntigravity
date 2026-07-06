-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: hayabusa.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `railway`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `railway`;

--
-- Table structure for table `auditoria_categoria`
--

DROP TABLE IF EXISTS `auditoria_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_categoria` (
  `id_auditoria_categoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT NULL,
  `id_almacenero` int DEFAULT NULL,
  `accion` varchar(30) NOT NULL DEFAULT 'MODIFICACION',
  PRIMARY KEY (`id_auditoria_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_categoria`
--

LOCK TABLES `auditoria_categoria` WRITE;
/*!40000 ALTER TABLE `auditoria_categoria` DISABLE KEYS */;
INSERT INTO `auditoria_categoria` VALUES (1,1,'Electrónica','2026-07-04 23:20:50',NULL,'MODIFICACION'),(2,1,'Electrónica','2026-07-05 17:03:58',NULL,'MODIFICACION'),(3,2,'Ropa y Moda','2026-07-05 17:03:58',NULL,'MODIFICACION'),(4,3,'Hogar y Cocina','2026-07-05 17:03:58',NULL,'MODIFICACION'),(5,4,'Deportes','2026-07-05 17:03:58',NULL,'MODIFICACION'),(6,5,'Libros','2026-07-05 17:03:58',NULL,'MODIFICACION'),(7,6,'Hardware','2026-07-05 17:03:58',NULL,'MODIFICACION'),(8,7,'Dispositivos móviles','2026-07-05 17:03:58',NULL,'MODIFICACION'),(9,8,'Software y licencias','2026-07-05 17:03:58',NULL,'MODIFICACION'),(10,9,'Relojes inteligentes','2026-07-05 17:03:58',NULL,'MODIFICACION'),(11,3,'Hogar y Cocina','2026-07-05 17:04:29',15,'MODIFICACION'),(12,10,'Categoria Ejemplo','2026-07-05 17:05:04',15,'MODIFICACION'),(13,3,'Hogar y Cocina Ejemplo','2026-07-05 20:26:26',NULL,'MODIFICACION');
/*!40000 ALTER TABLE `auditoria_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria_producto`
--

DROP TABLE IF EXISTS `auditoria_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_producto` (
  `id_auditoria_producto` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `fecha_modificacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `precio_pasado` decimal(10,2) NOT NULL,
  `precio_modificado` decimal(10,2) NOT NULL,
  `id_almacenero` int DEFAULT NULL,
  `stock_anterior` int NOT NULL,
  `stock_modificado` int NOT NULL,
  `accion` varchar(30) NOT NULL DEFAULT 'MODIFICACION',
  PRIMARY KEY (`id_auditoria_producto`),
  KEY `fk_auditoria_producto` (`id_producto`),
  CONSTRAINT `fk_auditoria_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_producto`
--

LOCK TABLES `auditoria_producto` WRITE;
/*!40000 ALTER TABLE `auditoria_producto` DISABLE KEYS */;
INSERT INTO `auditoria_producto` VALUES (1,1,'2026-05-03 15:57:41',100.00,200.00,0,0,0,'MODIFICACION'),(2,2,'2026-05-27 01:02:07',799.90,799.90,0,0,0,'MODIFICACION'),(3,1,'2026-05-27 02:37:08',200.00,180.00,0,0,0,'MODIFICACION'),(4,1,'2026-07-04 23:20:50',180.00,180.00,NULL,0,0,'MODIFICACION'),(5,14,'2026-07-05 18:19:31',100.00,100.00,15,0,0,'MODIFICACION'),(6,1,'2026-07-05 20:20:24',180.00,120.00,15,50,100,'MODIFICACION'),(7,1,'2026-07-06 00:09:59',120.00,120.00,NULL,100,98,'MODIFICACION'),(8,1,'2026-07-06 00:10:05',120.00,120.00,NULL,98,100,'MODIFICACION'),(9,3,'2026-07-06 00:16:35',1199.00,1199.00,NULL,120,118,'MODIFICACION'),(10,4,'2026-07-06 00:16:37',89.90,89.90,NULL,200,198,'MODIFICACION'),(11,1,'2026-07-06 00:23:22',120.00,120.00,NULL,100,98,'MODIFICACION');
/*!40000 ALTER TABLE `auditoria_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria_usuario`
--

DROP TABLE IF EXISTS `auditoria_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_usuario` (
  `id_auditoria_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_mfa_enabled` tinyint(1) NOT NULL,
  `totp_secret` varchar(255) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_admin` int DEFAULT NULL,
  `accion` varchar(30) NOT NULL DEFAULT 'MODIFICACION',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_usuario`
--

LOCK TABLES `auditoria_usuario` WRITE;
/*!40000 ALTER TABLE `auditoria_usuario` DISABLE KEYS */;
INSERT INTO `auditoria_usuario` VALUES (1,'E2E Tester','e2e_tester_sprint2@example.com','$2a$10$nazU3xQbzf0nQYJ82VxHf.hGb5jTT/CSqOv/rrEIV6IyIQ7oknnZe',0,NULL,11,NULL,'MODIFICACION','2026-07-06 07:34:13'),(2,'E2E Tester','e2e_tester_sprint2@example.com','$2a$10$eqPRd5lGyP3yO.a8mUHINez3Mzo8.i0IyLXvl9jFeyX2y4x8CR0PW',0,NULL,12,NULL,'MODIFICACION','2026-07-06 07:34:13'),(3,'E2E Tester','e2e_tester_sprint2@example.com','$2a$10$eqPRd5lGyP3yO.a8mUHINez3Mzo8.i0IyLXvl9jFeyX2y4x8CR0PW',0,'DBDKW3TQ7LDNMYDDTLG6HOCP5TS4P4CW',12,NULL,'MODIFICACION','2026-07-06 07:34:13'),(4,'Fabrizio Risco','fabrizio_risco@gmail.com','$2b$12$vx/qViHq0w16PGIl5IrpwuteyraamKoc4VhysWk4Y.W8U3/C.zMwu',0,NULL,7,NULL,'MODIFICACION','2026-07-06 07:34:13'),(5,'Fabrizio Risco','fabrizio_risco@gmail.com','$2b$12$vx/qViHq0w16PGIl5IrpwuteyraamKoc4VhysWk4Y.W8U3/C.zMwu',0,'AWQ3P6XZKKSFKYD7LHXABNBQQTGI32B7',7,NULL,'MODIFICACION','2026-07-06 07:34:13'),(6,'juan perez carranza','juan_perez@import.com','$2a$10$EaStO4CnZGLyEmpYG5GmGucOtL6O89B6lHO8s67w6UE46pmKi5VQO',0,NULL,13,NULL,'MODIFICACION','2026-07-06 07:34:13'),(7,'juan perez carranza','juan_perez@import.com','$2a$10$EaStO4CnZGLyEmpYG5GmGucOtL6O89B6lHO8s67w6UE46pmKi5VQO',0,'E5OQVW4B4FXGFC3HMMPLWSF4JDQPDTMS',13,NULL,'MODIFICACION','2026-07-06 07:34:13'),(8,'kevin risco romero','riscotu2@gmail.com','$2a$10$Ag0DJ8koU/w0rzrW3V8TvOce.m0rT6GmE/.SragpraLbZuOddNQp.',0,NULL,14,NULL,'MODIFICACION','2026-07-06 07:34:13'),(9,'kevin risco romero','riscotu2@gmail.com','$2a$10$Ag0DJ8koU/w0rzrW3V8TvOce.m0rT6GmE/.SragpraLbZuOddNQp.',0,'EA7QR4YETBYLN7IBSBYCBRES6YAKZAVO',14,NULL,'MODIFICACION','2026-07-06 07:34:13'),(10,'kevin risco romero','riscotu2@gmail.com','$2a$10$Ag0DJ8koU/w0rzrW3V8TvOce.m0rT6GmE/.SragpraLbZuOddNQp.',1,'EA7QR4YETBYLN7IBSBYCBRES6YAKZAVO',14,NULL,'MODIFICACION','2026-07-06 07:34:13'),(11,'Kevin Risco','kevin_risco@gmail.com','6f39ac25bce80e7443d47b0b66ddd34d9b8d350a28761f6cd9819acdfafa2597',0,NULL,1,NULL,'MODIFICACION','2026-07-06 07:34:13'),(12,'María López','maria.lopez@gmail.com','80f0ba29e909a928784db26475341a13c968335e56f9f942bd38159e1a988c85',0,NULL,2,NULL,'MODIFICACION','2026-07-06 07:34:13'),(13,'Andrés Vega','andres.vega@gmail.com','a8f8e086d09c67e5a440522fb2a32a7b17be73563476dc3cc2d8a09338e85bea',0,NULL,5,NULL,'MODIFICACION','2026-07-06 07:34:13'),(14,'Kevin Risco','kevin_risco@gmail.com','$2a$10$NT5gPNMoSOpNj24YG2PZs.DdplyOqTz.xn0Tnj8f9WChKZSb0.cTm',0,NULL,1,NULL,'MODIFICACION','2026-07-06 07:34:13'),(15,'Kevin Risco','kevin_risco@gmail.com','$2a$10$NT5gPNMoSOpNj24YG2PZs.DdplyOqTz.xn0Tnj8f9WChKZSb0.cTm',0,'UO2OPKN63ARJ6DOGZ4RTL7I2UTUF5MKX',1,NULL,'MODIFICACION','2026-07-06 07:34:13'),(16,'Inventario','inventario@gmail.com','$2a$10$EHK21XJtWy8SkAHoUY59L.KJ4d8RLYLndoT/akLm28tQrzY7WXamC',0,NULL,15,NULL,'MODIFICACION','2026-07-06 07:34:13'),(17,'Inventario','inventario@gmail.com','$2a$10$EHK21XJtWy8SkAHoUY59L.KJ4d8RLYLndoT/akLm28tQrzY7WXamC',0,'7BVY3C6FWVL2IYYHWI4YKCOU3CLUDPPV',15,NULL,'MODIFICACION','2026-07-06 07:34:13'),(18,'Andrés Vega','andres.vega@gmail.com','$2a$10$cFNhKtxvrdHxfj2TYMT8eesd0MsDv1/zoqW56UADbQ7rj1uLWb6Ie',0,NULL,5,NULL,'MODIFICACION','2026-07-06 07:34:13'),(19,'Andrés Vega','andres.vega@gmail.com','$2a$10$cFNhKtxvrdHxfj2TYMT8eesd0MsDv1/zoqW56UADbQ7rj1uLWb6Ie',0,'BRWYK6NTQDSYH3PP6JEK5SY7XWTE36HI',5,NULL,'MODIFICACION','2026-07-06 07:34:13'),(20,'María López','maria.lopez@gmail.com','$2a$10$OpKDVyR5Ee5hP4TYpMJTrOl1ODpkrwsN56cQDOFWrq.hbcVdQZus2',0,NULL,2,NULL,'MODIFICACION','2026-07-06 07:34:13'),(21,'María López','maria.lopez@gmail.com','$2a$10$OpKDVyR5Ee5hP4TYpMJTrOl1ODpkrwsN56cQDOFWrq.hbcVdQZus2',0,'Y4GKQZXQCZCD4G2DE23TNJC2XQDVVJP2',2,NULL,'MODIFICACION','2026-07-06 07:34:13');
/*!40000 ALTER TABLE `auditoria_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_log`
--

DROP TABLE IF EXISTS `backup_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backup_log` (
  `id_backup_log` bigint NOT NULL AUTO_INCREMENT,
  `archivo` varchar(255) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `tamano_bytes` bigint DEFAULT NULL,
  `id_admin` int DEFAULT NULL,
  `mensaje` varchar(500) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_backup_log`),
  KEY `idx_backup_fecha` (`fecha`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_log`
--

LOCK TABLES `backup_log` WRITE;
/*!40000 ALTER TABLE `backup_log` DISABLE KEYS */;
INSERT INTO `backup_log` VALUES (2,NULL,'MANUAL','ERROR',NULL,1,'Cannot run program \"mysqldump\": CreateProcess error=2, El sistema no puede encontrar el archivo especificado','2026-07-06 12:04:12');
/*!40000 ALTER TABLE `backup_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_carrito`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,2,'2026-04-01 10:00:00'),(2,3,'2026-04-05 15:30:00'),(3,4,'2026-04-10 08:00:00'),(5,7,'2026-05-26 19:54:15'),(6,5,'2026-07-03 00:09:17'),(7,15,'2026-07-05 12:04:13');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_detalle`
--

DROP TABLE IF EXISTS `carrito_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_detalle` (
  `id_detalle` bigint NOT NULL AUTO_INCREMENT,
  `id_carrito` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_carrito` (`id_carrito`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_detalle_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE,
  CONSTRAINT `carrito_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_detalle`
--

LOCK TABLES `carrito_detalle` WRITE;
/*!40000 ALTER TABLE `carrito_detalle` DISABLE KEYS */;
INSERT INTO `carrito_detalle` VALUES (3,2,6,1),(4,2,7,1),(5,3,9,2),(6,3,11,1);
/*!40000 ALTER TABLE `carrito_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Electrónica',1),(2,'Ropa y Moda',1),(3,'Laptop',1),(4,'Deportes',1),(5,'Libros',1),(6,'Hardware',1),(7,'Dispositivos móviles',1),(8,'Software y licencias',1),(9,'Relojes inteligentes',1),(10,'Categoria Ejemplo',0);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_categoria_before_update` BEFORE UPDATE ON `categoria` FOR EACH ROW BEGIN
            INSERT INTO auditoria_categoria (
                id_categoria,
                nombre,
                fecha_actualizacion,
                id_almacenero
            )
            VALUES (
                OLD.id_categoria,
                OLD.nombre,
                CURRENT_TIMESTAMP,
                @id_almacenero
            );
        END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_detalle` bigint NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `precio` double NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,1,1,2499.99),(2,1,4,1,89.9),(3,2,6,1,149.5),(4,2,4,3,89.9),(5,3,8,1,1850),(6,4,2,1,799.9),(7,5,4,1,89.9),(8,5,10,1,75),(9,6,2,1,799.9),(14,10,3,2,1199),(15,10,4,2,89.9),(16,11,1,2,120),(17,12,1,1,120),(18,13,2,2,799.9),(19,13,3,2,1199),(20,14,3,1,1199),(21,14,4,1,89.9),(22,14,5,1,549),(23,15,4,2,89.9),(24,16,5,1,549),(25,16,6,1,149.5),(26,17,6,2,149.5),(27,17,7,2,399),(28,17,8,2,1850),(29,18,7,1,399),(30,19,8,2,1850),(31,19,1,2,120);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial`
--

DROP TABLE IF EXISTS `historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial` (
  `id_historial` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `accion` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `permanencia` int DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_producto` (`id_producto`),
  KEY `idx_historial_usuario` (`id_usuario`),
  CONSTRAINT `historial_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `historial_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial`
--

LOCK TABLES `historial` WRITE;
/*!40000 ALTER TABLE `historial` DISABLE KEYS */;
INSERT INTO `historial` VALUES (1,2,1,'vista','2026-03-08 08:00:00',NULL),(2,2,1,'agregado','2026-03-08 08:05:00',NULL),(3,2,1,'compra','2026-03-10 09:00:00',NULL),(4,3,6,'vista','2026-03-17 13:00:00',NULL),(5,3,6,'agregado','2026-03-17 13:10:00',NULL),(6,3,6,'compra','2026-03-18 14:20:00',NULL),(7,4,8,'vista','2026-04-01 10:00:00',NULL),(8,4,8,'agregado','2026-04-01 10:15:00',NULL),(9,4,8,'compra','2026-04-02 11:00:00',NULL),(10,2,2,'vista','2026-04-14 09:00:00',NULL),(11,2,2,'agregado','2026-04-14 09:30:00',NULL),(12,5,3,'vista','2026-04-20 12:00:00',NULL),(13,5,5,'vista','2026-04-20 12:05:00',NULL);
/*!40000 ALTER TABLE `historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mfa`
--

DROP TABLE IF EXISTS `mfa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mfa` (
  `id_mfa` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `secreto` varchar(255) DEFAULT NULL,
  `habilitado` int NOT NULL,
  PRIMARY KEY (`id_mfa`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `mfa_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mfa`
--

LOCK TABLES `mfa` WRITE;
/*!40000 ALTER TABLE `mfa` DISABLE KEYS */;
INSERT INTO `mfa` VALUES (1,1,'JBSWY3DPEHPK3PXP',1),(2,2,'MFRGG4DBNZ2HGZLD',0),(3,3,NULL,0);
/*!40000 ALTER TABLE `mfa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` bigint NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `monto` double NOT NULL,
  `metodo` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  KEY `idx_pago_pedido` (`id_pedido`),
  CONSTRAINT `fk_pago_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (2,10,2577.8,'TARJETA','APROBADO','2026-07-05 19:16:29'),(3,11,240,'TARJETA','APROBADO','2026-07-05 19:23:19'),(4,12,120,'TARJETA','APROBADO','2026-05-27 00:28:59'),(5,13,3997.8,'PAYPAL','APROBADO','2026-06-03 00:29:00'),(6,14,1837.9,'TRANSFERENCIA','APROBADO','2026-06-09 00:29:01'),(7,15,179.8,'TARJETA','APROBADO','2026-06-18 00:29:02'),(8,16,698.5,'PAYPAL','APROBADO','2026-06-24 00:29:02'),(9,17,4797,'TRANSFERENCIA','APROBADO','2026-06-29 00:29:04');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `direccion_envio` varchar(255) DEFAULT NULL,
  `metodo_pago` varchar(100) DEFAULT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,2,'2026-03-10 09:00:00',2588.99,'ENTREGADO',NULL,NULL,NULL,NULL),(2,3,'2026-03-18 14:20:00',548.50,'ENTREGADO',NULL,NULL,NULL,NULL),(3,4,'2026-04-02 11:00:00',1850.00,'EN_PROCESO',NULL,NULL,NULL,NULL),(4,2,'2026-04-15 16:45:00',799.90,'EN_PROCESO',NULL,NULL,NULL,NULL),(5,3,'2026-04-20 10:10:00',169.90,'PAGADO',NULL,NULL,NULL,NULL),(6,7,'2026-05-26 20:02:01',799.90,'ENTREGADO','av izaguirre 111','TRANSFERENCIA','jauncito','987654321'),(10,2,'2026-07-05 19:16:28',2577.80,'ENTREGADO','skjdfkjsdf, Lima 1234','TARJETA','pepe gonzales rivera','987654321'),(11,2,'2026-07-05 19:23:18',240.00,'PAGADO','Avenida El Sol 111, Lima 15816','TARJETA','jhony','987654321'),(12,2,'2026-05-27 00:28:58',120.00,'ENTREGADO','Av. Siempre Viva 100, Lima 15000','TARJETA','María López','987654321'),(13,2,'2026-06-03 00:28:59',3997.80,'ENTREGADO','Av. Siempre Viva 101, Lima 15001','PAYPAL','María López','987654321'),(14,2,'2026-06-09 00:29:00',1837.90,'ENTREGADO','Av. Siempre Viva 102, Lima 15002','TRANSFERENCIA','María López','987654321'),(15,2,'2026-06-18 00:29:01',179.80,'PAGADO','Av. Siempre Viva 103, Lima 15003','TARJETA','María López','987654321'),(16,2,'2026-06-24 00:29:02',698.50,'PAGADO','Av. Siempre Viva 104, Lima 15004','PAYPAL','María López','987654321'),(17,2,'2026-06-29 00:29:03',4797.00,'PAGADO','Av. Siempre Viva 105, Lima 15005','TRANSFERENCIA','María López','987654321'),(18,2,'2026-07-03 00:29:04',399.00,'EN_PROCESO','Av. Siempre Viva 106, Lima 15006','TARJETA','María López','987654321'),(19,2,'2026-07-05 00:29:04',3940.00,'EN_PROCESO','Av. Siempre Viva 107, Lima 15007','PAYPAL','María López','987654321');
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `id_categoria` int DEFAULT NULL,
  `imagen_url` text,
  `estado` tinyint(1) DEFAULT '1',
  `descuento` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id_producto`),
  KEY `idx_producto_categoria` (`id_categoria`),
  FULLTEXT KEY `ft_nombre` (`nombre`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Laptop Lenovo IdeaPad 15','Procesador Intel Core i5, 8GB RAM, 512GB SSD, pantalla 15.6\"',120.00,98,1,'https://img.example.com/laptop-lenovo.jpg',1,0.00),(2,'Auriculares Sony WH-1000XM5','Cancelación de ruido activa, 30h batería, Bluetooth 5.2',799.90,79,1,'https://img.example.com/sony-wh1000xm5.jpg',1,0.00),(3,'Smartphone Samsung Galaxy A55','Pantalla AMOLED 6.6\", cámara 50MP, 5000mAh, Android 14',1199.00,118,1,'https://img.example.com/samsung-a55.jpg',1,0.00),(4,'Polo Deportivo Nike Dri-FIT','Tejido transpirable, corte regular, disponible en tallas S-XXL',89.90,198,2,'https://img.example.com/nike-polo.jpg',1,0.00),(5,'Zapatillas Adidas Ultraboost','Suela Boost, soporte de arco, ideal para running',549.00,75,2,'https://img.example.com/adidas-ub.jpg',1,0.00),(6,'Sartén Antiadherente Tefal','Diámetro 28cm, apta para inducción, libre de PFOA',149.50,60,3,'https://img.example.com/sarten-tefal.jpg',1,0.00),(7,'Cafetera Nespresso Vertuo','Cápsulas Vertuo, 1.1L depósito, 5 tamaños de taza',399.00,40,3,'https://img.example.com/nespresso.jpg',1,0.00),(8,'Bicicleta Estática Spinning','21 niveles de resistencia, pantalla LCD, volante de inercia 18kg',1850.00,15,4,'https://img.example.com/bici-spinning.jpg',1,0.00),(9,'Mancuernas Ajustables 20kg','Par de mancuernas de acero con discos desmontables',320.00,35,4,'https://img.example.com/mancuernas.jpg',1,0.00),(10,'El Quijote – Cervantes','Edición ilustrada tapa dura, 1200 páginas, prólogo de la RAE',75.00,100,5,'https://img.example.com/quijote.jpg',1,0.00),(11,'Cien Años de Soledad','Edición conmemorativa RAE, García Márquez, tapa dura',95.00,90,5,'https://img.example.com/cien-anios.jpg',1,0.00),(12,'Tablet Xiaomi Pad 6','Pantalla 11\" 144Hz, Snapdragon 870, 6GB RAM, 128GB',999.00,55,1,'https://img.example.com/xiaomi-pad6.jpg',0,0.00),(14,'Producto ejemplo','Descripción de producto ejemplo',100.00,50,10,'https://play-lh.googleusercontent.com/Gqxk4T0uZsDwFp07DE-508hkyvcNmgFuRwPiwTEfF7D7OzGv1FdHDzEyMxNsSBZLOJlGpe3ULvVM2RgrRAlBqA',1,0.00);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_producto_before_update` BEFORE UPDATE ON `producto` FOR EACH ROW BEGIN
    IF OLD.precio <> NEW.precio
       OR OLD.stock <> NEW.stock THEN

        INSERT INTO auditoria_producto (
            id_producto,
            fecha_modificacion,
            precio_pasado,
            precio_modificado,
            id_almacenero,
            stock_anterior,
            stock_modificado
        )
        VALUES (
            OLD.id_producto,
            NOW(),
            OLD.precio,
            NEW.precio,
            @id_almacenero,
            OLD.stock,
            NEW.stock
        );

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `recomendacion`
--

DROP TABLE IF EXISTS `recomendacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendacion` (
  `id_recomendacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_recomendacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `recomendacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `recomendacion_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacion`
--

LOCK TABLES `recomendacion` WRITE;
/*!40000 ALTER TABLE `recomendacion` DISABLE KEYS */;
INSERT INTO `recomendacion` VALUES (1,2,2,95.00,'2026-04-01 07:00:00'),(2,2,3,88.50,'2026-04-01 07:00:00'),(3,3,7,91.20,'2026-04-05 07:00:00'),(4,3,6,85.00,'2026-04-05 07:00:00'),(5,4,9,97.00,'2026-04-10 07:00:00'),(6,4,5,89.75,'2026-04-10 07:00:00'),(7,5,1,78.30,'2026-04-20 07:00:00'),(8,5,10,82.00,'2026-04-20 07:00:00');
/*!40000 ALTER TABLE `recomendacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperacion_contrasena`
--

DROP TABLE IF EXISTS `recuperacion_contrasena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recuperacion_contrasena` (
  `id_recuperacion` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expira_en` timestamp NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_recuperacion`),
  UNIQUE KEY `uk_recuperacion_token` (`token`),
  KEY `idx_recuperacion_usuario` (`id_usuario`),
  CONSTRAINT `fk_recuperacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacion_contrasena`
--

LOCK TABLES `recuperacion_contrasena` WRITE;
/*!40000 ALTER TABLE `recuperacion_contrasena` DISABLE KEYS */;
INSERT INTO `recuperacion_contrasena` VALUES (3,14,'69296721-c5bd-44f6-bda0-68d52cebd5aa','2026-07-01 16:00:56',1,'2026-07-01 15:45:56');
/*!40000 ALTER TABLE `recuperacion_contrasena` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resena`
--

DROP TABLE IF EXISTS `resena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resena` (
  `id_resena` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_producto` int NOT NULL,
  `calificacion` int NOT NULL,
  `comentario` varchar(1000) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_resena`),
  UNIQUE KEY `uk_resena_usuario_producto` (`id_usuario`,`id_producto`),
  KEY `idx_resena_producto` (`id_producto`),
  CONSTRAINT `fk_resena_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE,
  CONSTRAINT `fk_resena_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `chk_resena_calificacion` CHECK ((`calificacion` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resena`
--

LOCK TABLES `resena` WRITE;
/*!40000 ALTER TABLE `resena` DISABLE KEYS */;
INSERT INTO `resena` VALUES (2,2,2,4,'Ejemplo reseña','2026-07-06 02:11:33');
/*!40000 ALTER TABLE `resena` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'admin'),(2,'cliente'),(3,'inventario'),(4,'VENDEDOR');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_mfa_enabled` tinyint(1) DEFAULT '0',
  `totp_secret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuario_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Kevin Risco','kevin_risco@gmail.com','$2a$10$NT5gPNMoSOpNj24YG2PZs.DdplyOqTz.xn0Tnj8f9WChKZSb0.cTm',1,'2026-01-01 05:00:00',1,'UO2OPKN63ARJ6DOGZ4RTL7I2UTUF5MKX'),(2,'María López','maria.lopez@gmail.com','$2a$10$OpKDVyR5Ee5hP4TYpMJTrOl1ODpkrwsN56cQDOFWrq.hbcVdQZus2',1,'2026-01-15 08:30:00',1,'Y4GKQZXQCZCD4G2DE23TNJC2XQDVVJP2'),(3,'Carlos Mendoza','carlos.mendoza@hotmail.com','d942192b4d18ccc3d97e7e87106f2229c17ee223fc8a51c14f5ece34cbb52cf7',1,'2026-02-03 14:00:00',0,NULL),(4,'Lucía Torres','lucia.torres@yahoo.com','bae07dbe7af25300e2b55fa9d16de48747e6827a7ce7661d7a922cfaf1950f1b',1,'2026-02-20 09:45:00',0,NULL),(5,'Andrés Vega','andres.vega@gmail.com','$2a$10$cFNhKtxvrdHxfj2TYMT8eesd0MsDv1/zoqW56UADbQ7rj1uLWb6Ie',0,'2026-03-10 11:20:00',1,'BRWYK6NTQDSYH3PP6JEK5SY7XWTE36HI'),(7,'Fabrizio Risco','fabrizio_risco@gmail.com','$2b$12$vx/qViHq0w16PGIl5IrpwuteyraamKoc4VhysWk4Y.W8U3/C.zMwu',1,'2026-05-27 00:40:32',1,'AWQ3P6XZKKSFKYD7LHXABNBQQTGI32B7'),(8,'Administrador','admin@gmail.com','$2a$10$WCg9Aoa2AR76Hy0HaklX6.4299gnN5nDCcECXhTowk6HuMvArnZvu',1,'2026-06-15 18:10:45',0,NULL),(13,'juan perez carranza','juan_perez@import.com','$2a$10$EaStO4CnZGLyEmpYG5GmGucOtL6O89B6lHO8s67w6UE46pmKi5VQO',1,'2026-07-01 15:41:41',1,'E5OQVW4B4FXGFC3HMMPLWSF4JDQPDTMS'),(14,'kevin risco romero','riscotu2@gmail.com','$2a$10$KgcqaB8o4CN5Sf8NpQBJ8OLYbG4fuqMtVPn3VrfvWyxJcyljs.fkm',1,'2026-07-01 15:44:03',1,'EA7QR4YETBYLN7IBSBYCBRES6YAKZAVO'),(15,'Inventario','inventario@gmail.com','$2a$10$EHK21XJtWy8SkAHoUY59L.KJ4d8RLYLndoT/akLm28tQrzY7WXamC',1,'2026-07-01 15:55:11',1,'7BVY3C6FWVL2IYYHWI4YKCOU3CLUDPPV'),(31,'dayro','dayro_risco@gmail.com','$2a$10$sJjmduMvDfxeiKM0K57NLuLxY2RBUZjCQLRV6ov/kJTbg5MgEpPH.',1,NULL,0,NULL),(32,'Adm Fix','adm_fix@example.com','$2a$10$1XDRzkoL7QVnvlYuvNvfOOBslOY69KwxVH5TxysvxvTB70BobNT2a',1,'2026-07-06 17:22:16',1,'JBSWY3DPEHPK3PXP');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_usuario_before_update` BEFORE UPDATE ON `usuario` FOR EACH ROW BEGIN

    INSERT INTO auditoria_usuario (

        nombre,

        email,

        password,

        is_mfa_enabled,

        totp_secret,

        id_usuario

    )

    VALUES (

        OLD.nombre,

        OLD.email,

        OLD.password,

        OLD.is_mfa_enabled,

        OLD.totp_secret,

        OLD.id_usuario

    );

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `usuario_rol`
--

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_rol`
--

LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES (1,1),(32,1),(2,2),(3,2),(13,2),(14,2),(15,3),(5,4),(7,4),(31,4);
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'railway'
--
/*!50003 DROP PROCEDURE IF EXISTS `5_productoMasVendidos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `5_productoMasVendidos`()
begin
select p.id_producto, p.nombre, dp.cantidad from producto p join detalle_pedido dp on p.id_producto=dp.id_producto order by dp.cantidad desc limit 5;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `detallePedido_producto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `detallePedido_producto`()
begin
select * from producto p join detalle_pedido dp where p.id_producto=dp.id_producto;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_por_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `historial_por_usuario`(
    IN in_id_usuario INT
)
BEGIN
    SELECT *
    FROM historial
    WHERE id_usuario = in_id_usuario;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `producto_categoria` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `producto_categoria`()
begin 
select * from producto p join categoria c where p.id_categoria=c.id_categoria;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `usuario_pedido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `usuario_pedido`()
begin
select * from usuario u join pedido p where u.id_usuario=p.id_usuario;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-06 12:24:05
