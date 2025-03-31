-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 08:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qr_scanner`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(15) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `points` int(11) DEFAULT 0,
  `total_spent` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone_number`, `points`, `total_spent`, `created_at`) VALUES
(1, 'mg mg', '123123123', 26866, 0.00, '2025-02-23 12:40:08'),
(5, 'Mya Mya', '1111111', 1, 0.00, '2025-02-28 12:49:05'),
(6, 'htay hta', '2222222', 120, 0.00, '2025-02-28 13:15:24'),
(7, 'aa11', '09881122', 0, 0.00, '2025-02-28 14:10:07'),
(10, 'Win WIn', '09123123', 3600, 0.00, '2025-03-01 10:24:49'),
(14, 'Hla Hla', '121212', 851888, 2400.00, '2025-03-02 13:24:23'),
(15, 'Ko Phoe Loneqq', '12222222222', 1, 0.00, '2025-03-02 13:24:55');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `sellPrice` decimal(10,2) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `quantity`, `barcode`, `price`, `sellPrice`, `time_stamp`) VALUES
(1, 'Tha Na Khar', 99890, '1', 12.00, 1200.00, '2025-02-12 12:38:53'),
(2, 'bar bar ', 1, '123', 123.00, 121.00, '2025-02-12 13:02:29'),
(3, 'a', 6, '12', 12.00, 12.00, '2025-02-12 13:02:52'),
(4, 'b', 1000, '10', 12.00, 12.00, '2025-02-12 13:03:08'),
(5, 'c', 161, '2', 12.00, 12.00, '2025-02-12 13:03:17'),
(7, 'e', 10010, '4', 12.00, 15.00, '2025-02-12 13:04:04'),
(10, 'f', 994, '22', 1.00, 10.00, '2025-02-12 13:37:47'),
(13, 'Say', 995, '3', 1500.00, 1600.00, '2025-03-07 07:00:59'),
(15, 'Haircode', 131, '0', 100.00, 200.00, '2025-03-10 11:46:30'),
(16, 'Myat Hman', 996, '051111407592', 100.00, 1000.00, '2025-03-11 09:52:41');

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) NOT NULL,
  `final_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`order_id`, `user_id`, `order_date`, `total_amount`, `discount`, `final_amount`) VALUES
(17, 9, '2025-02-12 12:46:53', 240.00, 0.00, 240.00),
(18, 9, '2025-02-12 13:04:48', 132.00, 0.00, 132.00),
(19, 9, '2025-02-12 13:05:05', 156.00, 0.00, 156.00),
(20, 1, '2025-02-12 13:08:05', 120.00, 0.00, 120.00),
(21, 1, '2025-02-12 13:08:40', 228.00, 0.00, 228.00),
(22, 1, '2025-02-12 13:09:55', 144.00, 0.00, 144.00),
(23, 1, '2025-02-12 13:15:37', 24.00, 0.00, 24.00),
(24, 1, '2025-02-12 13:15:59', 36.00, 0.00, 36.00),
(25, 1, '2025-02-12 13:16:31', 12.00, 0.00, 12.00),
(26, 1, '2025-02-12 13:17:30', 120.00, 0.00, 120.00),
(27, 9, '2025-02-12 13:22:37', 120.00, 0.00, 120.00),
(28, 9, '2025-02-12 13:29:30', 120.00, 0.00, 120.00),
(29, 9, '2025-02-12 13:29:46', 1440.00, 0.00, 1440.00),
(30, 9, '2025-02-12 13:30:05', 11280.00, 0.00, 11280.00),
(31, 9, '2025-02-12 13:38:00', 130.00, 0.00, 130.00),
(32, 9, '2025-02-17 12:49:05', 720.00, 0.00, 720.00),
(33, 9, '2025-02-17 13:20:30', 360.00, 0.00, 360.00),
(34, 9, '2025-02-17 14:10:08', 120.00, 0.00, 120.00),
(35, 9, '2025-02-20 10:18:47', 120.00, 0.00, 120.00),
(36, 9, '2025-02-22 04:42:40', 120.00, 0.00, 120.00),
(41, 9, '2025-02-28 10:29:26', 120.00, 0.00, 120.00),
(42, 9, '2025-02-28 10:32:02', 120.00, 0.00, 120.00),
(43, 9, '2025-02-28 10:37:59', 120.00, 0.00, 120.00),
(44, 9, '2025-02-28 10:44:58', 492.00, 0.00, 492.00),
(45, 9, '2025-02-28 10:59:57', 120.00, 0.00, 120.00),
(46, 9, '2025-02-28 11:08:12', 120.00, 0.00, 120.00),
(47, 9, '2025-02-28 11:10:54', 120.00, 0.00, 120.00),
(48, 9, '2025-02-28 11:11:59', 120.00, 0.00, 120.00),
(49, 9, '2025-02-28 11:28:26', 264.00, 0.00, 264.00),
(50, 9, '2025-02-28 12:54:12', 120.00, 0.00, 120.00),
(51, 9, '2025-02-28 14:12:55', 1440.00, 0.00, 1440.00),
(52, 9, '2025-02-28 14:16:11', 120.00, 0.00, 120.00),
(53, 9, '2025-03-01 13:12:52', 120.00, 0.00, 120.00),
(54, 9, '2025-03-01 13:12:52', 120.00, 0.00, 120.00),
(55, 9, '2025-03-01 13:14:16', 12.00, 0.00, 12.00),
(56, 9, '2025-03-02 10:25:02', 120.00, 0.00, 120.00),
(57, 9, '2025-03-02 12:36:50', 120.00, 0.00, 120.00),
(58, 9, '2025-03-03 08:27:13', 120.00, 0.00, 120.00),
(59, 9, '2025-03-03 08:28:19', 120.00, 0.00, 120.00),
(60, 9, '2025-03-03 08:28:38', 120.00, 0.00, 120.00),
(61, 9, '2025-03-03 08:29:47', 120.00, 0.00, 120.00),
(62, 9, '2025-03-03 08:30:45', 120.00, 0.00, 120.00),
(63, 9, '2025-03-03 08:53:53', 120.00, 0.00, 120.00),
(64, 9, '2025-03-03 09:25:07', 132.00, 0.00, 132.00),
(68, 9, '2025-03-03 10:06:41', 1200.00, 0.00, 1200.00),
(74, 9, '2025-03-03 11:00:34', 120.00, 0.00, 120.00),
(75, 9, '2025-03-03 14:10:31', 120.00, 0.00, 120.00),
(76, 9, '2025-03-03 14:12:59', 36.00, 0.00, 36.00),
(77, 9, '2025-03-03 14:14:27', 240.00, 0.00, 240.00),
(78, 9, '2025-03-03 14:21:04', 1440.00, 0.00, 1440.00),
(79, 9, '2025-03-04 06:56:17', 720.00, 0.00, 720.00),
(80, 9, '2025-03-04 06:57:03', 96.00, 0.00, 96.00),
(85, 9, '2025-03-04 07:09:16', 120.00, 0.00, 120.00),
(86, 9, '2025-03-04 07:10:02', 120.00, 0.00, 120.00),
(87, 9, '2025-03-04 07:13:25', 120.00, 0.00, 120.00),
(88, 9, '2025-03-04 07:13:45', 120.00, 0.00, 120.00),
(89, 9, '2025-03-04 07:15:15', 480.00, 0.00, 480.00),
(90, 9, '2025-03-04 08:13:03', 120.00, 0.00, 120.00),
(91, 9, '2025-03-04 08:14:21', 120.00, 0.00, 120.00),
(92, 9, '2025-03-04 08:15:48', 120.00, 0.00, 120.00),
(93, 9, '2025-03-04 08:27:54', 120.00, 0.00, 120.00),
(94, 9, '2025-03-04 08:30:19', 120.00, 0.00, 120.00),
(95, 9, '2025-03-04 08:30:34', 120.00, 0.00, 120.00),
(96, 9, '2025-03-04 08:45:07', 240.00, 0.00, 240.00),
(97, 9, '2025-03-04 08:47:10', 240.00, 0.00, 240.00),
(98, 9, '2025-03-04 08:50:22', 120.00, 0.00, 120.00),
(99, 9, '2025-03-04 08:52:08', 120.00, 0.00, 120.00),
(100, 9, '2025-03-04 10:37:23', 120.00, 0.00, 120.00),
(101, 9, '2025-03-04 12:51:08', 240.00, 0.00, 240.00),
(102, 9, '2025-03-04 12:54:21', 120.00, 0.00, 120.00),
(103, 9, '2025-03-04 13:34:29', 3600.00, 0.00, 3600.00),
(105, 9, '2025-03-04 14:09:04', 840.00, 0.00, 840.00),
(106, 9, '2025-03-05 06:30:20', 240.00, 0.00, 240.00),
(107, 9, '2025-03-05 06:31:01', 132.00, 0.00, 132.00),
(108, 9, '2025-03-05 06:34:49', 120.00, 0.00, 120.00),
(109, 9, '2025-03-05 06:35:51', 120.00, 0.00, 120.00),
(110, 9, '2025-03-05 06:36:59', 120.00, 0.00, 120.00),
(111, 9, '2025-03-05 06:39:11', 120.00, 120.00, 0.00),
(112, 9, '2025-03-05 06:46:59', 120.00, 120.00, 0.00),
(113, 9, '2025-03-05 06:47:51', 12.00, 12.00, 0.00),
(114, 9, '2025-03-05 06:50:53', 12.00, 0.00, 12.00),
(115, 9, '2025-03-05 06:52:51', 12.00, 12.00, 0.00),
(116, 9, '2025-03-05 07:10:14', 120.00, 10.00, 110.00),
(117, 9, '2025-03-06 10:16:16', 120.00, 0.00, 120.00),
(118, 9, '2025-03-06 10:19:17', 480.00, 0.00, 480.00),
(119, 9, '2025-03-06 10:21:44', 120.00, 0.00, 120.00),
(120, 9, '2025-03-06 10:25:46', 12.00, 0.00, 12.00),
(121, 9, '2025-03-06 10:30:15', 120.00, 120.00, 0.00),
(122, 9, '2025-03-06 10:36:06', 120.00, 0.00, 120.00),
(123, 9, '2025-03-06 10:39:56', 120.00, 0.00, 120.00),
(124, 9, '2025-03-06 10:41:20', 240.00, 0.00, 240.00),
(125, 9, '2025-03-06 10:42:46', 120.00, 0.00, 120.00),
(126, 9, '2025-03-06 10:44:02', 144.00, 0.00, 144.00),
(127, 9, '2025-03-07 07:01:26', 1732.00, 0.00, 1732.00),
(128, 9, '2025-03-07 08:27:47', 120.00, 0.00, 120.00),
(131, 9, '2025-03-07 08:59:48', 252.00, 0.00, 252.00),
(132, 9, '2025-03-07 09:03:12', 132.00, 0.00, 132.00),
(133, 9, '2025-03-07 09:04:53', 120.00, 0.00, 120.00),
(134, 9, '2025-03-07 09:05:35', 8528.00, 0.00, 8528.00),
(135, 9, '2025-03-07 10:19:59', 14762.00, 0.00, 14762.00),
(136, 9, '2025-03-07 10:22:07', 48.00, 0.00, 48.00),
(137, 9, '2025-03-08 05:12:18', 6000.00, 0.00, 6000.00),
(138, 9, '2025-03-08 05:35:00', 120.00, 0.00, 120.00),
(139, 9, '2025-03-08 05:36:10', 120.00, 120.00, 0.00),
(140, 9, '2025-03-08 05:37:18', 120.00, 0.00, 120.00),
(141, 9, '2025-03-08 06:05:01', 12000.00, 0.00, 12000.00),
(143, 9, '2025-03-11 09:54:29', 3000.00, 0.00, 3000.00),
(144, 9, '2025-03-11 09:57:35', 1000.00, 1000.00, 0.00),
(145, 9, '2025-03-11 10:07:11', 2400.00, 0.00, 2400.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price_at_time` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `quantity`, `price_at_time`, `subtotal`) VALUES
(28, 17, 1, 2, 120.00, 240.00),
(29, 18, 1, 1, 120.00, 120.00),
(30, 18, 5, 1, 12.00, 12.00),
(31, 19, 5, 1, 12.00, 12.00),
(32, 19, 5, 1, 12.00, 12.00),
(33, 19, 1, 1, 120.00, 120.00),
(34, 19, 7, 1, 12.00, 12.00),
(35, 20, 1, 1, 120.00, 120.00),
(36, 21, 1, 1, 120.00, 120.00),
(37, 21, 5, 3, 12.00, 36.00),
(38, 21, 7, 6, 12.00, 72.00),
(39, 22, 4, 12, 12.00, 144.00),
(40, 23, 7, 2, 12.00, 24.00),
(41, 24, 7, 3, 12.00, 36.00),
(42, 25, 7, 1, 12.00, 12.00),
(43, 26, 1, 1, 120.00, 120.00),
(44, 27, 1, 1, 120.00, 120.00),
(45, 28, 1, 1, 120.00, 120.00),
(46, 29, 1, 12, 120.00, 1440.00),
(47, 30, 1, 94, 120.00, 11280.00),
(48, 31, 10, 13, 10.00, 130.00),
(49, 32, 1, 6, 120.00, 720.00),
(50, 33, 1, 3, 120.00, 360.00),
(51, 34, 1, 1, 120.00, 120.00),
(52, 35, 1, 1, 120.00, 120.00),
(53, 36, 1, 1, 120.00, 120.00),
(61, 44, 1, 4, 120.00, 480.00),
(62, 44, 5, 1, 12.00, 12.00),
(63, 45, 1, 1, 120.00, 120.00),
(64, 46, 1, 1, 120.00, 120.00),
(65, 47, 1, 1, 120.00, 120.00),
(66, 48, 1, 1, 120.00, 120.00),
(67, 49, 1, 2, 120.00, 240.00),
(68, 49, 5, 2, 12.00, 24.00),
(69, 50, 1, 1, 120.00, 120.00),
(70, 51, 1, 12, 120.00, 1440.00),
(71, 52, 1, 1, 120.00, 120.00),
(72, 53, 1, 1, 120.00, 120.00),
(73, 54, 1, 1, 120.00, 120.00),
(74, 55, 5, 1, 12.00, 12.00),
(75, 56, 1, 1, 120.00, 120.00),
(76, 57, 1, 1, 120.00, 120.00),
(77, 58, 1, 1, 120.00, 120.00),
(78, 59, 1, 1, 120.00, 120.00),
(79, 60, 1, 1, 120.00, 120.00),
(80, 61, 1, 1, 120.00, 120.00),
(81, 62, 1, 1, 120.00, 120.00),
(82, 63, 1, 1, 120.00, 120.00),
(83, 64, 1, 1, 120.00, 120.00),
(84, 64, 5, 1, 12.00, 12.00),
(90, 68, 1, 10, 120.00, 1200.00),
(96, 74, 1, 1, 120.00, 120.00),
(97, 75, 1, 1, 120.00, 120.00),
(98, 76, 5, 3, 12.00, 36.00),
(99, 77, 1, 1, 120.00, 120.00),
(100, 77, 1, 1, 120.00, 120.00),
(101, 78, 1, 12, 120.00, 1440.00),
(102, 79, 1, 6, 120.00, 720.00),
(103, 80, 5, 8, 12.00, 96.00),
(104, 85, 1, 1, 120.00, 120.00),
(105, 86, 1, 1, 120.00, 120.00),
(106, 87, 1, 1, 120.00, 120.00),
(107, 88, 1, 1, 120.00, 120.00),
(108, 89, 1, 4, 120.00, 480.00),
(109, 90, 1, 1, 120.00, 120.00),
(110, 91, 1, 1, 120.00, 120.00),
(111, 92, 1, 1, 120.00, 120.00),
(112, 93, 1, 1, 120.00, 120.00),
(113, 94, 1, 1, 120.00, 120.00),
(114, 95, 1, 1, 120.00, 120.00),
(115, 96, 1, 2, 120.00, 240.00),
(116, 97, 1, 2, 120.00, 240.00),
(117, 98, 1, 1, 120.00, 120.00),
(118, 99, 1, 1, 120.00, 120.00),
(119, 100, 1, 1, 120.00, 120.00),
(120, 101, 1, 2, 120.00, 240.00),
(121, 102, 1, 1, 120.00, 120.00),
(122, 103, 1, 30, 120.00, 3600.00),
(124, 105, 1, 7, 120.00, 840.00),
(125, 106, 1, 1, 120.00, 120.00),
(126, 106, 1, 1, 120.00, 120.00),
(127, 107, 1, 1, 120.00, 120.00),
(128, 107, 5, 1, 12.00, 12.00),
(129, 108, 1, 1, 120.00, 120.00),
(130, 109, 1, 1, 120.00, 120.00),
(131, 110, 1, 1, 120.00, 120.00),
(132, 111, 1, 1, 120.00, 120.00),
(133, 112, 1, 1, 120.00, 120.00),
(134, 113, 5, 1, 12.00, 12.00),
(135, 114, 5, 1, 12.00, 12.00),
(136, 115, 5, 1, 12.00, 12.00),
(137, 116, 1, 1, 120.00, 120.00),
(138, 117, 1, 1, 120.00, 120.00),
(139, 118, 1, 4, 120.00, 480.00),
(140, 119, 1, 1, 120.00, 120.00),
(141, 120, 5, 1, 12.00, 12.00),
(142, 121, 1, 1, 120.00, 120.00),
(143, 122, 1, 1, 120.00, 120.00),
(144, 123, 1, 1, 120.00, 120.00),
(145, 124, 1, 1, 120.00, 120.00),
(146, 124, 1, 1, 120.00, 120.00),
(147, 125, 1, 1, 120.00, 120.00),
(148, 126, 1, 1, 120.00, 120.00),
(149, 126, 5, 1, 12.00, 12.00),
(150, 126, 5, 1, 12.00, 12.00),
(151, 127, 1, 1, 120.00, 120.00),
(152, 127, 5, 1, 12.00, 12.00),
(153, 127, 13, 1, 1600.00, 1600.00),
(154, 128, 1, 1, 120.00, 120.00),
(158, 131, 1, 2, 120.00, 240.00),
(159, 131, 5, 1, 12.00, 12.00),
(160, 132, 1, 1, 120.00, 120.00),
(161, 132, 5, 1, 12.00, 12.00),
(162, 133, 1, 1, 120.00, 120.00),
(163, 134, 1, 4, 120.00, 480.00),
(164, 134, 5, 4, 12.00, 48.00),
(165, 134, 13, 5, 1600.00, 8000.00),
(166, 135, 2, 122, 121.00, 14762.00),
(167, 136, 3, 4, 12.00, 48.00),
(168, 137, 1, 50, 120.00, 6000.00),
(169, 138, 1, 1, 120.00, 120.00),
(170, 139, 1, 1, 120.00, 120.00),
(171, 140, 1, 1, 120.00, 120.00),
(172, 141, 1, 10, 1200.00, 12000.00),
(174, 143, 16, 1, 1000.00, 1000.00),
(175, 143, 16, 1, 1000.00, 1000.00),
(176, 143, 16, 1, 1000.00, 1000.00),
(177, 144, 16, 1, 1000.00, 1000.00),
(178, 145, 1, 1, 1200.00, 1200.00),
(179, 145, 1, 1, 1200.00, 1200.00);

-- --------------------------------------------------------

--
-- Table structure for table `point_settings`
--

CREATE TABLE `point_settings` (
  `id` int(11) NOT NULL,
  `points_per_amount` decimal(10,2) NOT NULL,
  `discount_per_point` decimal(10,2) NOT NULL,
  `minimum_points_for_discount` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_settings`
--

INSERT INTO `point_settings` (`id`, `points_per_amount`, `discount_per_point`, `minimum_points_for_discount`, `updated_by`, `updated_at`) VALUES
(1, 10.00, 10.00, 100, 9, '2025-02-23 12:38:35'),
(2, 123.00, 123.00, 123, 9, '2025-03-02 10:09:44'),
(3, 1.00, 1.00, 1, 9, '2025-03-02 10:15:11'),
(4, 1.00, 9.99, 100, 9, '2025-03-02 13:37:50'),
(5, 1.00, 9.99, 1000, 9, '2025-03-03 14:17:31'),
(6, 1.00, 10.00, 1000, 9, '2025-03-04 08:47:57'),
(7, 1.00, 10.00, 1000, 9, '2025-03-04 08:48:07');

-- --------------------------------------------------------

--
-- Table structure for table `point_transactions`
--

CREATE TABLE `point_transactions` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `points_earned` int(11) NOT NULL,
  `points_redeemed` int(11) DEFAULT 0,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_transactions`
--

INSERT INTO `point_transactions` (`id`, `customer_id`, `order_id`, `points_earned`, `points_redeemed`, `transaction_date`) VALUES
(1, 14, 17, 1000, 0, '2025-03-03 10:45:08'),
(4, 14, 74, 120, 0, '2025-03-03 11:00:34'),
(7, 1, 75, 120, 0, '2025-03-03 14:10:31'),
(8, 1, 76, 36, 0, '2025-03-03 14:12:59'),
(9, 1, 77, 240, 24, '2025-03-03 14:14:27'),
(10, 14, 78, 1440, 144, '2025-03-03 14:21:04'),
(11, 1, 79, 720, 0, '2025-03-04 06:56:17'),
(12, 14, 80, 96, 9, '2025-03-04 06:57:03'),
(13, 1, 85, 120, 12, '2025-03-04 07:09:16'),
(14, 14, 86, 120, 12, '2025-03-04 07:10:02'),
(15, 14, 87, 120, 12, '2025-03-04 07:13:25'),
(16, 14, 88, 120, 12, '2025-03-04 07:13:45'),
(17, 14, 89, 480, 48, '2025-03-04 07:15:15'),
(18, 1, 90, 120, 12, '2025-03-04 08:13:03'),
(19, 1, 91, 120, 0, '2025-03-04 08:14:21'),
(20, 14, 92, 120, 12, '2025-03-04 08:15:48'),
(21, 14, 93, 120, 12, '2025-03-04 08:27:54'),
(22, 14, 94, 120, 12, '2025-03-04 08:30:19'),
(23, 14, 95, 120, 12, '2025-03-04 08:30:34'),
(24, 14, 96, 240, 13000, '2025-03-04 08:45:07'),
(25, 14, 97, 240, 1000, '2025-03-04 08:47:10'),
(26, 1, 98, 120, 2000, '2025-03-04 08:50:22'),
(27, 1, 99, 120, 0, '2025-03-04 08:52:08'),
(28, 14, 100, 120, 0, '2025-03-04 10:37:23'),
(29, 1, 101, 240, 8000, '2025-03-04 12:51:08'),
(30, 14, 102, 120, 0, '2025-03-04 12:54:21'),
(31, 10, 103, 3600, 0, '2025-03-04 13:34:29'),
(32, 14, 105, 840, 0, '2025-03-04 14:09:04'),
(33, 1, 106, 240, 0, '2025-03-05 06:30:20'),
(34, 14, 107, 132, 0, '2025-03-05 06:31:01'),
(35, 14, 108, 120, 1000, '2025-03-05 06:34:49'),
(36, 14, 109, 120, 12000, '2025-03-05 06:35:51'),
(37, 14, 110, 120, 12000, '2025-03-05 06:36:59'),
(38, 14, 111, 120, 12000, '2025-03-05 06:39:11'),
(39, 14, 112, 120, 12000, '2025-03-05 06:46:59'),
(40, 14, 113, 12, 1000, '2025-03-05 06:47:51'),
(41, 1, 114, 12, 0, '2025-03-05 06:50:53'),
(42, 14, 115, 12, 1000, '2025-03-05 06:52:51'),
(43, 1, 116, 120, 1000, '2025-03-05 07:10:14'),
(44, 1, 117, 120, 0, '2025-03-06 10:16:16'),
(45, 1, 118, 480, 0, '2025-03-06 10:19:17'),
(46, 1, 119, 120, 0, '2025-03-06 10:21:44'),
(47, 1, 120, 12, 0, '2025-03-06 10:25:46'),
(48, 14, 121, 120, 12000, '2025-03-06 10:30:15'),
(49, 1, 122, 120, 0, '2025-03-06 10:36:06'),
(50, 14, 123, 120, 0, '2025-03-06 10:39:56'),
(51, 14, 124, 240, 0, '2025-03-06 10:41:20'),
(52, 14, 125, 120, 0, '2025-03-06 10:42:46'),
(53, 14, 126, 144, 0, '2025-03-06 10:44:02'),
(54, 1, 127, 1732, 0, '2025-03-07 07:01:26'),
(55, 1, 128, 120, 0, '2025-03-07 08:27:47'),
(56, 1, 131, 252, 0, '2025-03-07 08:59:48'),
(57, 1, 132, 132, 0, '2025-03-07 09:03:12'),
(58, 1, 133, 120, 0, '2025-03-07 09:04:53'),
(59, 1, 134, 8528, 0, '2025-03-07 09:05:35'),
(60, 1, 135, 14762, 0, '2025-03-07 10:19:59'),
(61, 1, 136, 48, 0, '2025-03-07 10:22:07'),
(62, 14, 137, 6000, 0, '2025-03-08 05:12:18'),
(63, 6, 138, 120, 0, '2025-03-08 05:35:00'),
(64, 14, 139, 120, 12000, '2025-03-08 05:36:10'),
(65, 14, 140, 120, 0, '2025-03-08 05:37:18'),
(66, 14, 141, 12000, 0, '2025-03-08 06:05:01'),
(67, 14, 143, 3000, 0, '2025-03-11 09:54:29'),
(68, 14, 144, 1000, 100000, '2025-03-11 09:57:35'),
(69, 14, 145, 2400, 0, '2025-03-11 10:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `expected_date` date NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED') DEFAULT 'PENDING',
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `item_id`, `quantity`, `supplier_id`, `expected_date`, `order_date`, `status`, `created_by`) VALUES
(8, 15, 11, 1, '2025-03-14', '2025-03-12 12:16:43', 'RECEIVED', 9),
(9, 5, 12, 1, '2025-03-13', '2025-03-12 12:24:50', 'RECEIVED', 9);

-- --------------------------------------------------------

--
-- Table structure for table `sales_analytics`
--

CREATE TABLE `sales_analytics` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `total_sales` int(11) DEFAULT NULL,
  `revenue` decimal(10,2) DEFAULT NULL,
  `avg_price` decimal(10,2) DEFAULT NULL,
  `stock_level` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_analytics`
--

INSERT INTO `sales_analytics` (`id`, `date`, `barcode`, `item_name`, `total_sales`, `revenue`, `avg_price`, `stock_level`, `created_at`) VALUES
(505, '2025-03-07', '1', 'Tha Na Khar', 4, 480.00, 120.00, 99958, '2025-03-07 09:05:37'),
(506, '2025-03-07', '2', 'c', 4, 48.00, 12.00, 149, '2025-03-07 09:05:37'),
(507, '2025-03-07', '3', 'Say', 5, 8000.00, 1600.00, 995, '2025-03-07 09:05:37'),
(508, '2025-02-12', '1', 'Tha Na Khar', 115, 13800.00, 120.00, 99958, '2025-03-07 09:14:15'),
(509, '2025-02-12', '10', 'b', 12, 144.00, 12.00, 1000, '2025-03-07 09:14:15'),
(510, '2025-02-12', '2', 'c', 6, 72.00, 12.00, 149, '2025-03-07 09:14:15'),
(511, '2025-02-12', '22', 'profit', 13, 130.00, 10.00, 994, '2025-03-07 09:14:15'),
(512, '2025-02-12', '4', 'e', 13, 156.00, 12.00, 10010, '2025-03-07 09:14:15'),
(513, '2025-02-17', '1', 'Tha Na Khar', 10, 1200.00, 120.00, 99958, '2025-03-07 09:14:15'),
(514, '2025-02-20', '1', 'Tha Na Khar', 1, 120.00, 120.00, 99958, '2025-03-07 09:14:15'),
(515, '2025-02-22', '1', 'Tha Na Khar', 1, 120.00, 120.00, 99958, '2025-03-07 09:14:15'),
(516, '2025-02-26', '1', 'Tha Na Khar', NULL, NULL, NULL, 99958, '2025-03-07 09:14:15'),
(517, '2025-02-28', '1', 'Tha Na Khar', 25, 2880.00, 120.00, 99958, '2025-03-07 09:14:15'),
(518, '2025-02-28', '2', 'c', 3, 36.00, 12.00, 149, '2025-03-07 09:14:15'),
(519, '2025-03-01', '1', 'Tha Na Khar', 2, 240.00, 120.00, 99958, '2025-03-07 09:14:15'),
(520, '2025-03-01', '2', 'c', 1, 12.00, 12.00, 149, '2025-03-07 09:14:15'),
(521, '2025-03-02', '1', 'Tha Na Khar', 2, 240.00, 120.00, 99958, '2025-03-07 09:14:15'),
(522, '2025-03-03', '1', 'Tha Na Khar', 33, 3960.00, 120.00, 99958, '2025-03-07 09:14:15'),
(523, '2025-03-03', '2', 'c', 4, 48.00, 12.00, 149, '2025-03-07 09:14:15'),
(524, '2025-03-04', '1', 'Tha Na Khar', 67, 8040.00, 120.00, 99958, '2025-03-07 09:14:15'),
(525, '2025-03-04', '2', 'c', 8, 96.00, 12.00, 149, '2025-03-07 09:14:15'),
(526, '2025-03-05', '1', 'Tha Na Khar', 9, 1080.00, 120.00, 99958, '2025-03-07 09:14:15'),
(527, '2025-03-05', '2', 'c', 4, 48.00, 12.00, 149, '2025-03-07 09:14:15'),
(528, '2025-03-06', '1', 'Tha Na Khar', 13, 1560.00, 120.00, 99958, '2025-03-07 09:14:15'),
(529, '2025-03-06', '2', 'c', 3, 36.00, 12.00, 149, '2025-03-07 09:14:15'),
(530, '2025-03-07', '1', 'Tha Na Khar', 10, 1200.00, 120.00, 99958, '2025-03-07 09:14:15'),
(531, '2025-03-07', '2', 'c', 7, 84.00, 12.00, 149, '2025-03-07 09:14:15'),
(532, '2025-03-07', '3', 'Say', 6, 9600.00, 1600.00, 995, '2025-03-07 09:14:15'),
(539, '2025-03-07', '123', 'bar bar ', 122, 14762.00, 121.00, 1, '2025-03-07 10:20:00'),
(540, '2025-03-07', '12', 'a', 4, 48.00, 12.00, 6, '2025-03-07 10:22:08'),
(541, '2025-03-08', '1', 'Tha Na Khar', 50, 6000.00, 120.00, 99908, '2025-03-08 05:12:21'),
(542, '2025-03-08', '1', 'Tha Na Khar', 1, 120.00, 120.00, 99907, '2025-03-08 05:35:03'),
(543, '2025-03-08', '1', 'Tha Na Khar', 1, 120.00, 120.00, 99906, '2025-03-08 05:36:15'),
(544, '2025-03-08', '1', 'Tha Na Khar', 1, 120.00, 120.00, 99905, '2025-03-08 05:37:22'),
(545, '2025-03-08', '1', 'Tha Na Khar', 10, 12000.00, 1200.00, 99895, '2025-03-08 06:05:03'),
(546, '2025-03-11', '051111407592', 'Myat Hman', 1, 1000.00, 1000.00, 997, '2025-03-11 09:54:31'),
(547, '2025-03-11', '051111407592', 'Myat Hman', 1, 1000.00, 1000.00, 997, '2025-03-11 09:54:31'),
(548, '2025-03-11', '051111407592', 'Myat Hman', 1, 1000.00, 1000.00, 997, '2025-03-11 09:54:31'),
(549, '2025-03-11', '051111407592', 'Myat Hman', 1, 1000.00, 1000.00, 996, '2025-03-11 09:57:36'),
(550, '2025-03-11', '1', 'Tha Na Khar', 1, 1200.00, 1200.00, 99890, '2025-03-11 10:07:14'),
(551, '2025-03-11', '1', 'Tha Na Khar', 1, 1200.00, 1200.00, 99890, '2025-03-11 10:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `phone_number`, `email`, `address`, `created_at`) VALUES
(1, 'U mya', '091231233', 'umya@gmail.com', '23C 79/80 Mandalay', '2025-03-12 10:34:04'),
(3, 'THUYA HTUN', '977336554', 'thuyatun61638@gamil.com', '14', '2025-03-12 11:17:49'),
(4, 'Maung Naing', '09256561638', 'psy150039@gmail.com', 'Chan Mya Thar Si/Yangon', '2025-03-12 12:46:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`id`, `username`, `email`, `password`, `isAdmin`) VALUES
(1, 'q', 'q@q.com', 'q', 0),
(2, 'hello', 'helo@gmail.com', '12123', 0),
(3, 'QQ', '1@1', '1', 0),
(4, 'qq', '1@11', '1', 0),
(5, 'Q', 'HELO@gmail.com', '123', 0),
(6, 'thuya', '2@2', '123', 0),
(7, 'h', 'h@h', 'h', 0),
(9, 'admin', 'admin@admin.com', 'admin', 1),
(10, 'hi', 'hi@hi', 'hi', 0),
(11, 'lala', 'lala@lala.com', 'lala', 1),
(12, 'Kyaw Kyaw', 'kyaw@email.com', 'kyaw', 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view purchase_orders`
-- (See below for the actual view)
--
CREATE TABLE `view purchase_orders` (
);

-- --------------------------------------------------------

--
-- Structure for view `view purchase_orders`
--
DROP TABLE IF EXISTS `view purchase_orders`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view purchase_orders`  AS SELECT `purchase_orders`.`id` AS `id`, `purchase_orders`.`item_name` AS `item_name`, `purchase_orders`.`quantity` AS `quantity`, `purchase_orders`.`supplier` AS `supplier`, `purchase_orders`.`expected_date` AS `expected_date`, `purchase_orders`.`order_date` AS `order_date`, `purchase_orders`.`status` AS `status`, `purchase_orders`.`created_by` AS `created_by` FROM `purchase_orders` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `barcode` (`barcode`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_item_id` (`item_id`);

--
-- Indexes for table `point_settings`
--
ALTER TABLE `point_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `point_transactions`
--
ALTER TABLE `point_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `purchase_orders_ibfk_3` (`supplier_id`);

--
-- Indexes for table `sales_analytics`
--
ALTER TABLE `sales_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barcode` (`barcode`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `point_settings`
--
ALTER TABLE `point_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `point_transactions`
--
ALTER TABLE `point_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sales_analytics`
--
ALTER TABLE `sales_analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=552;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_history` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Constraints for table `point_settings`
--
ALTER TABLE `point_settings`
  ADD CONSTRAINT `point_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `user_table` (`id`);

--
-- Constraints for table `point_transactions`
--
ALTER TABLE `point_transactions`
  ADD CONSTRAINT `point_transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `point_transactions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order_history` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user_table` (`id`),
  ADD CONSTRAINT `purchase_orders_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `sales_analytics`
--
ALTER TABLE `sales_analytics`
  ADD CONSTRAINT `sales_analytics_ibfk_1` FOREIGN KEY (`barcode`) REFERENCES `items` (`barcode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
