package persistance

import (
	"context"

	"github.com/jphacks/os_2404/domain/entity"
	"github.com/jphacks/os_2404/domain/repository"
	"github.com/jphacks/os_2404/infra/database"
	d "github.com/jphacks/os_2404/infra/persistance/dto"
)

var _ repository.IUserRepository = &UserRepository{}

type UserRepository struct {
	conn *database.Conn
}

func NewUserRepository(conn *database.Conn) repository.IUserRepository {
	return &UserRepository{
		conn: conn,
	}
}

func (ur *UserRepository) CreateUser(ctx context.Context, user *entity.User) (*entity.User, error) {
	query := `
	INSERT INTO users (id, name,img)
	VALUES (:id,:name,:img)
	`
	dto := d.UserEntityToDto(user)

	_, err := ur.conn.DB.NamedExecContext(ctx, query, &dto)
	if err != nil {
		return nil, err
	}
	return d.UserDtoToEntity(&dto), nil
}

func (ur *UserRepository) DeleteUser(ctx context.Context, id string) error {
	query := `
	DELETE FROM users
	WHERE id = :id
	`

	_, err := ur.conn.DB.NamedExecContext(ctx, query, map[string]interface{}{"id": id})
	if err != nil {
		return err
	}

	return nil
}

func (ur *UserRepository) GetUser(ctx context.Context, id string) (*entity.User, error) {
	query := `
	SELECT *
	FROM users
	WHERE id = ?
	`
	var dto d.UserDto
	err := ur.conn.DB.GetContext(ctx, &dto, query, id)
	if err != nil {
		return nil, err
	}
	return d.UserDtoToEntity(&dto), nil
}
