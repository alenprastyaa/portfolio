-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 23 Jun 2026 pada 06.41
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `Artikels`
--

CREATE TABLE `Artikels` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `konten` text DEFAULT NULL,
  `tanggal` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `statusTampil` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `Heros`
--

CREATE TABLE `Heros` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `headline` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Heros`
--

INSERT INTO `Heros` (`id`, `nama`, `role`, `headline`, `deskripsi`, `createdAt`, `updatedAt`) VALUES
(1, 'Alen Prastya', 'Software Engineer & Technology Consultant', 'Transforming Ideas into Powerful Digital Experiences', 'Passionate Software Engineer with expertise in full-stack web development, system architecture, and digital transformation. Experienced in creating enterprise applications, business management systems, educational platforms, and cloud-based solutions using modern technologies. Dedicated to developing high-performance applications that combine exceptional user experiences with robust and scalable back-end systems.', '2026-06-23 01:54:18', '2026-06-23 03:43:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `Kontaks`
--

CREATE TABLE `Kontaks` (
  `id` int(11) NOT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Kontaks`
--

INSERT INTO `Kontaks` (`id`, `whatsapp`, `email`, `linkedin`, `github`, `lokasi`, `createdAt`, `updatedAt`) VALUES
(1, '+6285719578195', 'alenprastya@gmail.com', '-', 'https://github.com/alenprastyaa/', 'Jakarta, Indonesia', '2026-06-23 01:54:18', '2026-06-23 04:24:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `Layanans`
--

CREATE TABLE `Layanans` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `statusTampil` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Layanans`
--

INSERT INTO `Layanans` (`id`, `nama`, `deskripsi`, `createdAt`, `updatedAt`, `statusTampil`) VALUES
(1, 'Custom Web Application Development', 'Design and develop scalable, secure, and high-performance web applications tailored to business requirements using modern technologies such as Vue.js, React.js, Node.js, and Golang.', '2026-06-23 04:14:41', '2026-06-23 04:14:41', 1),
(2, 'REST API Development', 'Build robust, secure, and well-documented RESTful APIs that support web, mobile, and third-party integrations while following clean architecture and best development practices.', '2026-06-23 04:14:54', '2026-06-23 04:14:54', 1),
(3, 'Frontend Development', 'Create responsive, interactive, and user-friendly interfaces using Vue.js, React.js, Next.js, Tailwind CSS, and Bootstrap to deliver exceptional user experiences.', '2026-06-23 04:15:08', '2026-06-23 04:15:08', 1),
(4, 'Backend Development', 'Develop reliable server-side applications, business logic, authentication systems, and database integrations using Node.js, Express.js, Golang, MySQL, and PostgreSQL.', '2026-06-23 04:15:21', '2026-06-23 04:15:21', 1),
(6, 'Business Information System Development', 'Develop custom management systems including CRM, ERP, inventory management, HR systems, cashier applications, and reporting dashboards to improve business operations.', '2026-06-23 04:15:50', '2026-06-23 04:15:50', 1),
(7, 'AI Integration Solutions', 'Integrate AI-powered features into web applications, including intelligent automation, data processing, chatbot integration, and AI-assisted workflows for business systems.', '2026-06-23 04:16:08', '2026-06-23 04:16:08', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `Pengalamans`
--

CREATE TABLE `Pengalamans` (
  `id` int(11) NOT NULL,
  `posisi` varchar(255) DEFAULT NULL,
  `perusahaan` varchar(255) DEFAULT NULL,
  `periode` varchar(255) DEFAULT NULL,
  `tanggungJawab` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `statusTampil` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Pengalamans`
--

INSERT INTO `Pengalamans` (`id`, `posisi`, `perusahaan`, `periode`, `tanggungJawab`, `createdAt`, `updatedAt`, `statusTampil`) VALUES
(1, 'Software Developer', 'Seleris Meditekno Internasional', 'February 2025 – Present', 'Developed and maintained AI-powered web applications and internal business systems.\nDesigned and implemented scalable RESTful APIs using Node.js, Express.js, and Golang (Gin Framework).\nCollaborated with UI/UX designers, product managers, and data scientists to deliver AI-driven features.\nOptimized application performance, security, and maintainability.\nImplemented software development best practices including Git workflows, testing, and CI/CD pipelines.\nParticipated in system architecture design and technical decision-making.', '2026-06-23 04:12:12', '2026-06-23 04:12:12', 1),
(2, 'Freelance Full Stack Developer', 'Self-Employed', '2023 – Present', 'Delivered end-to-end web application solutions for clients across multiple industries.\nDeveloped responsive frontend applications using Vue.js, React.js, and Next.js.\nBuilt scalable backend systems and RESTful APIs using Node.js, Express.js, and Golang.\nManaged project requirements, system design, development, deployment, and maintenance.\nDeployed production applications on Linux VPS environments using Nginx and SSL.\nProvided technical consultation and translated business requirements into software solutions.\nMaintained multiple projects while ensuring quality and timely delivery.', '2026-06-23 04:12:38', '2026-06-23 04:12:38', 1),
(3, 'Informatics Teacher', 'SMK PGRI 1 Jakarta', 'September 2022 – February 2025', 'Taught web development, algorithms, and software engineering concepts.\nDelivered hands-on training in HTML, CSS, Bootstrap, JavaScript, Node.js, and React.js.\nSupervised student projects and guided learners in building real-world applications.\nDeveloped educational materials and project-based learning activities.\nMentored students in technology competitions and professional skill development.', '2026-06-23 04:13:04', '2026-06-23 04:13:04', 1),
(4, 'Full Stack Developer', 'Nuragatech', 'September 2020 – January 2021', 'Developed backend services and APIs using Node.js and Express.js.\nDesigned and optimized relational databases using MySQL and PostgreSQL.\nBuilt responsive web interfaces using modern JavaScript technologies.\nIntegrated frontend and backend systems to deliver complete web solutions.\nAssisted in system maintenance, debugging, and performance optimization.', '2026-06-23 04:13:27', '2026-06-23 04:13:27', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `Pengaturans`
--

CREATE TABLE `Pengaturans` (
  `id` int(11) NOT NULL,
  `namaWebsite` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `footerNote` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `showHero` tinyint(1) DEFAULT 1,
  `showProfil` tinyint(1) DEFAULT 1,
  `showSkills` tinyint(1) DEFAULT 1,
  `showProjects` tinyint(1) DEFAULT 1,
  `showPengalaman` tinyint(1) DEFAULT 1,
  `showLayanan` tinyint(1) DEFAULT 1,
  `showTestimoni` tinyint(1) DEFAULT 1,
  `showArtikel` tinyint(1) DEFAULT 1,
  `showKontak` tinyint(1) DEFAULT 1,
  `showFooter` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Pengaturans`
--

INSERT INTO `Pengaturans` (`id`, `namaWebsite`, `logo`, `footerNote`, `createdAt`, `updatedAt`, `showHero`, `showProfil`, `showSkills`, `showProjects`, `showPengalaman`, `showLayanan`, `showTestimoni`, `showArtikel`, `showKontak`, `showFooter`) VALUES
(1, 'Alen Portfolio', '', '© 2026 Professional Portfolio', '2026-06-23 01:54:18', '2026-06-23 04:22:28', 1, 1, 0, 1, 1, 1, 0, 0, 1, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `Profils`
--

CREATE TABLE `Profils` (
  `id` int(11) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `keahlian` text DEFAULT NULL,
  `fokus` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Profils`
--

INSERT INTO `Profils` (`id`, `deskripsi`, `keahlian`, `fokus`, `createdAt`, `updatedAt`) VALUES
(1, 'Full Stack Developer with a strong background in building modern web applications, RESTful APIs, business management systems, and digital platforms. Experienced in delivering scalable, secure, and user-centric solutions using modern JavaScript frameworks and cloud-based technologies. Passionate about transforming complex requirements into efficient and impactful digital products.', 'Full Stack Web Development\nRESTful API Development\nDatabase Design & Management\nBusiness Information Systems\nLearning Management Systems (LMS)\nDashboard & Reporting Systems\nAuthentication & Authorization\nSystem Integration\nResponsive Web Design\nSoftware Architecture\nCloud Deployment & DevOps\nTechnical Education & Mentoring', 'Technology Focus\n\nFrontend\n\nVue.js\nNuxt.js\nReact.js\nNext.js\nJavaScript (ES6+)\nTypeScript\nTailwind CSS\nBootstrap\n\nBackend\n\nNode.js\nExpress.js\nGolang\nREST API Development\n\nDatabase\n\nMySQL\nPostgreSQL\nMongoDB\n\nTools & Platforms\n\nGit & GitHub\nDocker\nNginx\nLinux Server Administration\nPM2\nPostman\n\nCloud & Deployment\n\nVPS Management\nCI/CD Implementation\nSSL Configuration\nCloud Infrastructure Management\n\nOther Skills\n\nTechnical Documentation\nSystem Analysis\nUI/UX Collaboration\nSoftware Project Management\nIT Training & Education', '2026-06-23 02:22:57', '2026-06-23 03:45:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `Projects`
--

CREATE TABLE `Projects` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `deskripsiSingkat` text DEFAULT NULL,
  `deskripsiLengkap` text DEFAULT NULL,
  `kategori` varchar(255) DEFAULT NULL,
  `teknologi` varchar(255) DEFAULT NULL,
  `linkDemo` varchar(255) DEFAULT NULL,
  `linkGithub` varchar(255) DEFAULT NULL,
  `linkDokumentasi` varchar(255) DEFAULT NULL,
  `statusTampil` tinyint(1) DEFAULT 1,
  `featured` tinyint(1) DEFAULT 0,
  `urutan` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Projects`
--

INSERT INTO `Projects` (`id`, `judul`, `thumbnail`, `deskripsiSingkat`, `deskripsiLengkap`, `kategori`, `teknologi`, `linkDemo`, `linkGithub`, `linkDokumentasi`, `statusTampil`, `featured`, `urutan`, `createdAt`, `updatedAt`) VALUES
(1, 'Learning Management System (LMS)', 'https://upload.alentest.my.id/portfolio/projects/2026/06/986f0212-459b-47c7-b2b5-afaebdd0941b.png', 'A comprehensive Learning Management System designed to manage online courses, student enrollment, assessments, certifications, and learning progress tracking.', 'Developed a full-featured Learning Management System (LMS) that enables educational institutions, training centers, and organizations to deliver online learning experiences efficiently. The platform provides role-based access for administrators, instructors, and students.\n\nKey features include course management, lesson publishing, online examinations, assignment submissions, student progress tracking, certificate generation, discussion forums, and reporting dashboards. The system was designed with scalability and user experience in mind, allowing organizations to manage thousands of learners while maintaining optimal performance and security.\n\nThe project also includes API integration, responsive design for mobile devices, authentication and authorization, file management, and analytics for monitoring learner engagement and performance.', 'Web Application', 'Vue.js, Golang , Postgresql, Express.js, MySQL, Pinia, Tailwind CSS, JWT Authentication, Nginx, SystemD, Github', 'https://lms.idschoolsystem.com/', 'https://github.com/alenprastyaa/go-lms', NULL, 1, 0, 1, '2026-06-23 04:01:54', '2026-06-23 04:04:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `Skills`
--

CREATE TABLE `Skills` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `tingkat` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `statusTampil` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `Testimonis`
--

CREATE TABLE `Testimonis` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `perusahaan` varchar(255) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `statusTampil` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Users`
--

INSERT INTO `Users` (`id`, `username`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2b$10$TrzDtDHT6Ve.GGQ7yFr8wuu5UCin/7STu6K5hglpz6I7bLc3s7wMG', '2026-06-23 01:54:18', '2026-06-23 01:54:18');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `Artikels`
--
ALTER TABLE `Artikels`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Heros`
--
ALTER TABLE `Heros`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Kontaks`
--
ALTER TABLE `Kontaks`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Layanans`
--
ALTER TABLE `Layanans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Pengalamans`
--
ALTER TABLE `Pengalamans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Pengaturans`
--
ALTER TABLE `Pengaturans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Profils`
--
ALTER TABLE `Profils`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Projects`
--
ALTER TABLE `Projects`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Skills`
--
ALTER TABLE `Skills`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Testimonis`
--
ALTER TABLE `Testimonis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `username_14` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `Artikels`
--
ALTER TABLE `Artikels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `Heros`
--
ALTER TABLE `Heros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `Kontaks`
--
ALTER TABLE `Kontaks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `Layanans`
--
ALTER TABLE `Layanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `Pengalamans`
--
ALTER TABLE `Pengalamans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `Pengaturans`
--
ALTER TABLE `Pengaturans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `Profils`
--
ALTER TABLE `Profils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `Projects`
--
ALTER TABLE `Projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `Skills`
--
ALTER TABLE `Skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `Testimonis`
--
ALTER TABLE `Testimonis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
