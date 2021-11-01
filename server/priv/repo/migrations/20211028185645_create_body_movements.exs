defmodule Server.Repo.Migrations.CreateBodyMovements do
  use Ecto.Migration

  def change do
    create table(:body_movements) do
      add :user_id, :uuid
      add :data, :map

      timestamps()
    end
  end
end
