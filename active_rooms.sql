-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: active_rooms
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `area_room`
--

DROP TABLE IF EXISTS `area_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area_room` (
  `area_id` varchar(10) NOT NULL,
  `room_id` varchar(10) NOT NULL,
  `room_name` int DEFAULT NULL,
  PRIMARY KEY (`area_id`,`room_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `area_room_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_room`
--

LOCK TABLES `area_room` WRITE;
/*!40000 ALTER TABLE `area_room` DISABLE KEYS */;
INSERT INTO `area_room` VALUES ('1','7',201),('2','8',202),('3','10',301),('3','13',401),('4','11',302),('5','12',303),('6','9',203),('7','1',101),('7','2',102),('7','3',103),('8','4',104),('8','5',105),('8','6',106);
/*!40000 ALTER TABLE `area_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `path` varchar(200) DEFAULT NULL,
  `restriction` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES ('1','Building 1','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('2','Building 2','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('3','Building 3','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('4','Building 4','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('5','Building 5','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('6','Building 6','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('7','Building 7','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('8','Building 8','Default description','M0,0 L10,0 L10,10 L0,10 Z',10);
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` varchar(10) NOT NULL,
  `description` text,
  `area` int unsigned NOT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `room_name` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('1','Conference Room',7,12,22,0,101),('10','Conference Room',3,10,20,2,301),('11','Conference Room',4,11,20,2,302),('12','Conference Room',5,10,20,2,303),('13','Computers Room',3,100,150,3,401),('14','Computers Room',6,300,400,0,101),('2','Conference Room',7,310,160,0,102),('3','Conference Room',7,460,310,0,103),('4','Conference Room',8,13,23,0,104),('5','Conference Room',8,320,170,0,105),('6','Conference Room',8,470,320,0,106),('7','Conference Room',1,10,20,1,201),('8','Conference Room',2,300,150,1,202),('9','Conference Room',6,450,300,1,203);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms_new`
--

DROP TABLE IF EXISTS `rooms_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms_new` (
  `id` varchar(10) NOT NULL,
  `description` text,
  `area` int unsigned NOT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `floor` int DEFAULT NULL,
  PRIMARY KEY (`id`,`area`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms_new`
--

LOCK TABLES `rooms_new` WRITE;
/*!40000 ALTER TABLE `rooms_new` DISABLE KEYS */;
INSERT INTO `rooms_new` VALUES ('101','Conference Room',7,12,22,0),('102','Conference Room',7,310,160,0),('103','Conference Room',7,460,310,0),('104','Conference Room',8,13,23,0),('105','Conference Room',8,320,170,0),('106','Conference Room',8,470,320,0),('201','Conference Room',1,10,20,1),('202','Conference Room',2,300,150,1),('203','Conference Room',6,450,300,1),('301','Conference Room',3,10,20,2),('302','Conference Room',4,11,20,2),('303','Conference Room',5,10,20,2);
/*!40000 ALTER TABLE `rooms_new` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensors`
--

DROP TABLE IF EXISTS `sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensors` (
  `id` varchar(10) NOT NULL,
  `room_id` varchar(10) DEFAULT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `status` enum('available','occupied','error') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensors`
--

LOCK TABLES `sensors` WRITE;
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;
INSERT INTO `sensors` VALUES ('S001','7',90,50,'available','2025-08-02 22:16:08','2025-08-05 16:32:35'),('S002','6',100,100,'available','2025-08-04 12:37:06','2025-08-05 15:08:43'),('S003','9',80,190,'error','2025-08-02 22:16:08','2025-08-05 15:08:43'),('S005','10',250,350,'occupied','2025-08-04 12:10:05','2025-08-05 15:08:43'),('S009','4',250,470,'available','2025-08-04 13:02:58','2025-08-05 15:08:43'),('S010','8',6,5,'available','2025-08-05 17:00:16','2025-08-05 17:00:16'),('S099','9',66,66,'available','2025-08-06 13:47:58','2025-08-06 13:48:16'),('S111','2',55,55,'available','2025-08-06 11:13:28','2025-08-06 11:13:28'),('S444','11',4,5,'available','2025-08-06 15:34:59','2025-08-06 15:34:59');
/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trans`
--

DROP TABLE IF EXISTS `trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trans` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `DateAcquired` datetime NOT NULL,
  `AcquisitionPrice` int NOT NULL,
  `DateSold` datetime DEFAULT NULL,
  `AskingPrice` int DEFAULT NULL,
  `SalesPrice` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `WorkID` int NOT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `TransCustomerFK` (`CustomerID`),
  KEY `TransWorkFK` (`WorkID`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trans`
--

LOCK TABLES `trans` WRITE;
/*!40000 ALTER TABLE `trans` DISABLE KEYS */;
INSERT INTO `trans` VALUES (100,'2005-04-11 00:00:00',30000,'2005-04-12 00:00:00',45000,42500,1001,500),(104,'2005-11-07 00:00:00',250,'2005-12-19 00:00:00',500,500,1001,511),(108,'2005-11-17 00:00:00',250,'2006-12-12 00:00:00',500,400,1004,522);
/*!40000 ALTER TABLE `trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('U001','admin','admin123','admin@hit.ac.il','054-1234567',1),('U002','user','user123','user@hit.ac.il','054-7654321',0),('U003','manager','manager123','manager@hit.ac.il','054-9876543',1),('U004','student','student123','student@hit.ac.il','054-5555555',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work`
--

DROP TABLE IF EXISTS `work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work` (
  `WorkID` int NOT NULL AUTO_INCREMENT,
  `Title` char(35) NOT NULL,
  `Copy` char(12) NOT NULL,
  `Medium` char(35) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT 'Unknown provenance',
  `ArtistID` int NOT NULL,
  PRIMARY KEY (`WorkID`),
  UNIQUE KEY `WorkAK1` (`Title`,`Copy`),
  KEY `ArtistFK` (`ArtistID`)
) ENGINE=InnoDB AUTO_INCREMENT=591 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work`
--

LOCK TABLES `work` WRITE;
/*!40000 ALTER TABLE `work` DISABLE KEYS */;
INSERT INTO `work` VALUES (500,'Memories 4','Unique','Casein rice paper collage','31 X 24.8 in.',18),(511,'Surf and Bird','142/500','High Quality Limited Print','NorthWest School Expressionist style',19),(521,'The Tilled Field','788/1000','High Quality Limited Print','Early Surrealist style',1),(522,'La Lecon de Ski','353/500','High Quality Limited Print','Surrealist style',1),(524,'Woman With A Hat','596/750','High Quality Limited Print','A very colourful impressionist piece',4),(548,'Night Bird','Unique','Watercolour on paper','50X72.5 cm. - Signed',19),(553,'The Dance','734/1000','High Quality Limited Print','An Impressionist masterpiece',4),(586,'Spanish Dancer','588/750','High Quality Limited Print','American Realist style - From work in Spain',11),(590,'Blue Interior','Unique','Tempera on card','43.9 X 28 in.',17);
/*!40000 ALTER TABLE `work` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-06 18:48:23
