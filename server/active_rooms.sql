-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: active_rooms
-- ------------------------------------------------------
-- Server version	9.2.0

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
INSERT INTO `area_room` VALUES ('1','7',201),('2','8',202),('29','38',60),('29','39',66),('3','10',301),('3','13',401),('4','11',302),('5','12',303),('6','9',203),('7','1',101),('7','2',102),('7','3',103),('8','4',104),('8','5',105),('8','6',106);
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
INSERT INTO `areas` VALUES ('1','Building 1','Default description ','M0,0 L10,0 L10,10 L0,10 Z',10),('2','Building 2','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('29','Labs','Labs outside',NULL,0),('3','Building 3','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('4','Building 4','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('5','Building 5','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('6','Building 6','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('7','Building 7','Default description','M0,0 L10,0 L10,10 L0,10 Z',10),('8','Building 8','Default description','M0,0 L10,0 L10,10 L0,10 Z',10);
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
  `area` int DEFAULT NULL,
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
INSERT INTO `rooms` VALUES ('1','building 7 floor 0 room 112',7,690,380,4,401),('10','building 3 floor 2 room 201',3,100,190,2,201),('11','building 4 floor 2 room 101',4,240,180,1,101),('12','building 5 floor 2 room 220',5,300,370,2,220),('13','building 3 floor 3 room 401',3,100,220,4,401),('14','building 6 floor 0 room 101',6,530,360,1,101),('2','building 7 floor 0 room 102',7,650,440,1,102),('3','building 7 floor 0 room 103',7,670,430,1,103),('38','Lab num 1',29,250,250,NULL,60),('39','Lab num 2',29,396,274,NULL,66),('4','building 8 floor 0 room 201',8,230,500,2,201),('5','building 8 floor 0 room 300',8,300,450,3,300),('55','Lab num 3',NULL,324,246,NULL,62),('6','building 8 floor 0 room 201',8,290,490,2,201),('7','building 1 floor 1 room 201',1,100,50,2,201),('8','building 2 floor 1 room 201',2,80,100,2,201),('9','building 6 floor 1 room 216',6,520,390,2,216);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
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
  KEY `room_id` (`room_id`),
  CONSTRAINT `fk_sensors_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensors`
--

LOCK TABLES `sensors` WRITE;
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;
INSERT INTO `sensors` VALUES ('S001','9',520,390,'occupied','2025-08-02 22:16:08','2025-08-09 22:08:12'),('S002','3',670,430,'occupied','2025-08-04 12:37:06','2025-08-22 23:23:37'),('S003','11',240,180,'available','2025-08-02 22:16:08','2025-08-11 17:59:20'),('S005','10',100,190,'available','2025-08-04 12:10:05','2025-08-08 00:01:09'),('S007','2',650,440,'available','2025-08-07 23:58:21','2025-08-07 23:58:21'),('S009','6',290,490,'occupied','2025-08-04 13:02:58','2025-08-18 17:11:13'),('S010','8',80,100,'available','2025-08-08 22:26:29','2025-08-20 11:33:24'),('S014','4',230,500,'occupied','2025-08-07 23:59:39','2025-08-07 23:59:39'),('S019','1',690,380,'error','2025-08-14 14:16:33','2025-08-14 14:16:33'),('S022','55',324,246,'error','2025-08-23 08:28:38','2025-08-23 08:28:38'),('S023','13',100,220,'occupied','2025-08-08 00:02:53','2025-08-08 00:02:53'),('S024','14',530,360,'available','2025-08-08 00:00:23','2025-08-22 23:17:52'),('S031','39',396,274,'available','2025-08-23 08:16:59','2025-08-23 08:16:59'),('S033','5',300,450,'error','2025-08-07 23:52:59','2025-08-08 22:19:48'),('S055','12',300,370,'occupied','2025-08-14 11:51:39','2025-08-17 16:38:07'),('S088','7',100,50,'available','2025-08-20 15:05:36','2025-08-20 15:07:32'),('S099','38',250,250,'available','2025-08-22 21:48:31','2025-08-23 00:08:29');
/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-23 19:59:11
