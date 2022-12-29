-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: mta_shopians
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orders_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`orders_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'92, Phường Hội Hợp, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc',33980000,'2022-11-14 16:22:37','0915373964',0,2),(2,'nothing, Xã Cách Bi, Huyện Quế Võ, Tỉnh Bắc Ninh',16990000,'2022-11-14 16:23:11','0915373964',2,2),(3,'Khai Quang, Xã Sính Lủng, Huyện Đồng Văn, Tỉnh Hà Giang',34287600,'2022-11-15 15:25:46','0915373964',2,2),(4,'THCS Vĩnh Yên, Xã Định Trung, Thành phố Vĩnh Yên, Tỉnh Vĩnh Phúc',1795199.9999999998,'2022-11-25 09:59:18','0915373964',0,2),(5,'THPT Chuyên Phan Bội Châu, Phường Biên Giang, Huyện Quỳ Hợp, Tỉnh Nghệ An',42478000,'2022-12-16 14:58:42','0915373964',2,2),(6,'Đại học công nghệ, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Thành phố Hà Nội',96977800,'2022-12-23 09:18:51','0946243197',2,3),(7,'Đại học Thuỷ lợi, Xã Phú Thị, Huyện Gia Lâm, Thành phố Hà Nội',595000,'2022-12-23 09:27:47','0946243197',2,3),(8,'THPT Chuyên Phan Bội Châu, Xã Nghĩa Xuân, Huyện Quỳ Hợp, Tỉnh Nghệ An',73663900,'2022-12-23 12:43:13','0915373964',2,2),(9,'đại học thuỷ lợi, Phường Trung Liệt, Quận Đống Đa, Thành phố Hà Nội',25536800,'2022-12-23 12:58:20','0915373964',2,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-29  7:40:12
