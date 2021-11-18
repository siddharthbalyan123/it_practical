-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 18, 2021 at 05:31 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `it_prac`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(50) NOT NULL,
  `uid` int(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `uid`, `title`, `category`, `content`) VALUES
(29, 4, 'This is by another user', 'Test', 'Random Text'),
(33, 4, 'This is by another user', 'Text', 'Random'),
(34, 1, 'This is by this user', 'Drama', 'Random text'),
(38, 1, 'Playstation', 'Games', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Sid', 'sid@gmail.com', '$2a$08$LeY//kMMzEQSdl.7esWLNOqvXKh/oDH.uFKcVH8/ALt9WYak5NSya'),
(2, 'dfasf', 'aasv@gmail.com', '$2a$08$lqdeH7AtmCH1VjDwTpyO3em/ajimhxrVE/0EEwEIF1w.qiFYQPeaO'),
(3, 'sid', 'afassd@gmail.com', '$2a$08$cYMFo/OfB3eXGh9RSjvofeF7JXhiC/EZeGCvtGRS0XTkjb9Q5V7nm'),
(4, 'sidd', 's@gmail.com', '$2a$08$YdcteWgZPhbny5runSZAeOle62.XlSLN8BiCj292OhSxTp2XijDIq'),
(9, 'John', 'siddharth.balyan2000@gmail.com', '$2a$08$HXPTGsCErz3DUZWQms4K5O.f1INlvfaSw5Nijx7UnoCX/Xj.z55c6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
