/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fi36_schaklewski_fpadw
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `fi36_schaklewski_fpadw`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fi36_schaklewski_fpadw` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `fi36_schaklewski_fpadw`;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (111,17,1,2,'2024-11-26 12:04:57'),(119,18,6,5,'2024-11-26 14:41:15');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,13,'2024-11-22 12:04:29'),(2,13,'2024-11-22 12:51:41'),(3,13,'2024-11-22 12:57:57'),(4,13,'2024-11-22 13:01:13'),(5,13,'2024-11-22 13:04:09'),(6,13,'2024-11-22 13:07:30'),(7,13,'2024-11-22 13:10:04'),(8,13,'2024-11-22 13:16:04'),(9,13,'2024-11-22 13:18:43'),(10,13,'2024-11-22 13:21:44'),(11,13,'2024-11-22 13:24:27'),(12,13,'2024-11-22 13:27:18'),(13,13,'2024-11-25 10:02:57'),(14,13,'2024-11-25 10:03:43'),(15,13,'2024-11-25 10:06:53'),(16,13,'2024-11-25 10:07:53'),(17,13,'2024-11-25 10:13:12'),(18,13,'2024-11-25 10:34:18'),(19,13,'2024-11-25 10:34:33'),(20,16,'2024-11-25 10:39:40'),(21,16,'2024-11-25 10:45:02'),(22,16,'2024-11-25 10:49:53'),(23,16,'2024-11-25 10:51:24'),(24,16,'2024-11-25 10:51:51'),(25,16,'2024-11-26 11:59:41'),(26,17,'2024-11-26 12:04:42'),(27,13,'2024-11-26 12:44:54'),(28,18,'2024-11-26 12:50:37'),(29,16,'2024-11-27 09:19:21'),(30,16,'2024-11-28 08:49:13');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,16,NULL,1),(2,16,NULL,13),(3,17,NULL,1),(4,17,NULL,13),(5,18,5,1),(6,18,1,13),(7,19,5,1),(8,20,1,1),(9,20,2,3),(10,21,1,1),(11,21,2,3),(12,22,1,1),(13,22,2,3),(14,23,1,1),(15,23,2,3),(16,24,1,3),(17,25,2,10),(18,25,3,5),(19,26,1,2),(20,26,2,2),(21,26,3,2),(22,27,5,1),(23,27,3,5),(24,28,4,6),(25,28,7,8),(26,29,1,15),(27,30,1,11),(28,30,2,2);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Produkt 1','Frisches Duschgel mit angenehmem Duft',5.99,'product1.jpg'),(2,'Produkt 2','Erfrischendes Duschgel für den täglichen Gebrauch',6.99,'product2.jpg'),(3,'Produkt 3','Pflegendes Duschgel mit Feuchtigkeit',7.99,'product3.jpg'),(4,'Produkt 4','Belebendes Duschgel für einen frischen Start',5.49,'product4.jpg'),(5,'Produkt 5','Sanftes Duschgel für empfindliche Haut',6.49,'product5.jpg'),(6,'Produkt 6','Duschgel mit natürlichen Extrakten',8.99,'product6.jpg'),(7,'Produkt 7','Hydratisierendes Duschgel für trockene Haut',7.49,'product7.jpg'),(8,'Produkt 8','Revitalisierendes Duschgel mit Vitaminen',9.49,'product8.jpg'),(9,'Produkt 9','Beruhigendes Duschgel mit Aloe Vera',7.99,'product9.jpg'),(10,'Produkt 10','Duschgel mit frischem Zitrusduft',6.99,'product10.jpg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@nivea.de','$2a$10$7clHGw8QsKh3GSzMC/nlQO/bu7F.vWQAYPbnjn372W5Lr4N6rt1eS'),(3,'test1@nivea.de','$2a$10$3CuIRPpKYuD/YkYKKdpCuO4uNrOccDYQTelHtBDfx253VvUmFAqMu'),(4,'test2@nivea.de','$2a$10$6ZnmwS82ZIMOqieqZLeiC.ka1kKxSjcMNmcHzukTrOU05uuUsL9Jy'),(5,'newuser@nivea.de','$2a$10$QhHS62vNMQyOr68t4sUxCeu1auCfTaTqy9t.vRUakWbMkxZAqaRXq'),(7,'test9@nivea.de','$2a$10$BWikN3pJUtIsN6nX5snZOuCTZIWyd7GXSGqRa8ONEzOeVEk09uoji'),(9,'testx@nivea.de','$2a$10$yWMm2yr5Rream5bAu6uAEul2W4CHlJGoqHZoLx7XABsbMWvZO4EbW'),(10,'test13@nivea.de','$2a$10$8VxlwO2QIVYtxW7YVzzEWOjxI.3N2BiYBdTMQ.Lbz1OaDdvFzDuTC'),(12,'test10@nivea.de','$2a$10$4bV6YWecu1JAoG8lZToZgOjRKuYxl1vB8e6f2QOSBCIejl45TtP46'),(13,'ww@nivea.de','$2a$10$1bb0kXvkVoIQZQ1howDh5elwmQBtMYG8SsKJPClE73npC6kOGhqAe'),(14,'testw@nivea.de','$2a$10$pY1IqTDJ3ob1iqzSd9y7..QWrYOH8JdGEw48e4EQK8UVuqbmywyTG'),(15,'testt@nivea.de','$2a$10$.bAQtC5KXdnkLg8Zp/yRy.j2AnsxtPHyzrXQTcvxuyCW4PXj0BgWC'),(16,'ee@nivea.de','$2a$10$hM7u2rbP7Dcfwihe.fv3LuZeuCWt4Khx3ZgfSNjiN5e7Lzi0gq6da'),(17,'peter@nivea.de','$2a$10$.wf6u6tTltNtp6gAlBcPhu5j1Dcv0mj.NOEDoy1ZMUVslpMsTDw2K'),(18,'e@nivea.de','$2a$10$vA1y.qWSCPVGW1Ns0oqp7.JR./EXQlEM.VR3gzFOFUwcQ9wU6O136');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 10:40:02
