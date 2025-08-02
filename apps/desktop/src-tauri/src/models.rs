use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct Book {
    pub id: String,
    pub title: String,
    pub author: String,
    pub quantity: i32,
    pub isbn: String,
    pub category: String,
    pub status: BookStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum BookStatus {
    Available,
    Unavailable,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Student {
    pub id: String,
    pub name: String,
    pub grade: String,
    pub phone_number: Option<String>,
    pub student_id: String,
    pub status: StudentStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum StudentStatus {
    Active,
    Inactive,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Lending {
    pub id: String,
    pub book_id: String,
    pub student_id: String,
    pub lent_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
    pub status: LendingStatus,
    pub due_date: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum LendingStatus {
    Lent,
    Returned,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LendingWithDetails {
    pub id: String,
    pub book_id: String,
    pub student_id: String,
    pub lent_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
    pub status: LendingStatus,
    pub due_date: DateTime<Utc>,
    pub book_title: String,
    pub book_author: String,
    pub student_name: String,
    pub student_number: String,
}

impl std::fmt::Display for BookStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BookStatus::Available => write!(f, "available"),
            BookStatus::Unavailable => write!(f, "unavailable"),
        }
    }
}

impl std::str::FromStr for BookStatus {
    type Err = String;
    
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "available" => Ok(BookStatus::Available),
            "unavailable" => Ok(BookStatus::Unavailable),
            _ => Err(format!("Invalid book status: {}", s)),
        }
    }
}

impl std::fmt::Display for StudentStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StudentStatus::Active => write!(f, "active"),
            StudentStatus::Inactive => write!(f, "inactive"),
        }
    }
}

impl std::str::FromStr for StudentStatus {
    type Err = String;
    
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "active" => Ok(StudentStatus::Active),
            "inactive" => Ok(StudentStatus::Inactive),
            _ => Err(format!("Invalid student status: {}", s)),
        }
    }
}

impl std::fmt::Display for LendingStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LendingStatus::Lent => write!(f, "lent"),
            LendingStatus::Returned => write!(f, "returned"),
        }
    }
}

impl std::str::FromStr for LendingStatus {
    type Err = String;
    
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "lent" => Ok(LendingStatus::Lent),
            "returned" => Ok(LendingStatus::Returned),
            _ => Err(format!("Invalid lending status: {}", s)),
        }
    }
}