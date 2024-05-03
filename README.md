# CRUD APIs with 'fs' Module

This repository contains CRUD APIs implemented using the 'fs' module for managing trainers and members. There are two main files in this project:

1. **Trainers.json**
2. **Members.json**

## Features

- **Middleware Usage:**
  - Middleware to check if the member is unique when using POST method.
  - Middleware to verify if a member ID exists and if the member is softly deleted.
  - Middleware to verify if a trainer ID exists.

- **GET All Members Revenues:**
  - Retrieve revenues information for all members.

- **GET Specific Trainer Revenues:**
  - Obtain revenues information for a specific trainer based on their members.

- **Soft DELETE:**
  - DELETE operation performs a soft delete.

- **Member Access Control:**
  - Check if a specific member's membership has ended. If ended, the member isn't allowed to enter.

- **GET All Members with Their Trainers:**
  - Retrieve all members along with their corresponding trainers.

- **GET Trainers with Their Members:**
  - Fetch all trainers along with their associated members.

- **GET Specific Member:**
  - Retrieve details of a specific member.

- **GET Specific Trainer:**
  - Retrieve details of a specific trainer.

## Endpoints

### Trainers

- **GET /trainers**: Get all trainers.
- **GET /trainers/:id**: Get a specific trainer by ID.
- **POST /trainers**: Create a new trainer.
- **PUT /trainers/:id**: Update an existing trainer.
- **DELETE /trainers/:id**: Soft delete a trainer by ID.

### Members

- **GET /members**: Get all members.
- **GET /members/:id**: Get a specific member by ID.
- **POST /members**: Create a new member.
- **PUT /members/:id**: Update an existing member.
- **DELETE /members/:id**: Soft delete a member by ID.
### Statistics APIs
- **GET /membersrev**: Get revenues information for all members.
- **GET /trainersrev/:id**:  Get revenues information for a specific trainer based on their members.
