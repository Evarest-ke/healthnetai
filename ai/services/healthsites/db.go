package healthsites

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/lib/pq"
)

const createTableSQL = `
CREATE TABLE IF NOT EXISTS healthsites (
    osm_id BIGINT PRIMARY KEY,
    osm_type VARCHAR(50),
    amenity VARCHAR(100),
    healthcare VARCHAR(100),
    name VARCHAR(255),
    operator_type VARCHAR(100),
    operational_status VARCHAR(50),
    opening_hours TEXT,
    beds VARCHAR(50),
    addr_city VARCHAR(100),
    changeset_id DECIMAL,
    changeset_version DECIMAL,
    changeset_timestamp TIMESTAMP,
    changeset_user VARCHAR(255),
    uuid VARCHAR(100),
    coordinates JSON,
    completeness DECIMAL
);`

type DBStore struct {
	db *sql.DB
}

func NewDBStore() (*DBStore, error) {
	connStr := "postgresql://neondb_owner:npg_gY5v8GrzThda@ep-flat-smoke-a8pxa57g-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	// Create table if it doesn't exist
	if _, err := db.Exec(createTableSQL); err != nil {
		return nil, fmt.Errorf("failed to create table: %v", err)
	}

	return &DBStore{db: db}, nil
}

func (s *DBStore) UpsertHealthSite(sites []HealthSite) error {
	// Begin transaction
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	query := `
        INSERT INTO healthsites (
            osm_id, osm_type, amenity, healthcare, name, operator_type,
            operational_status, opening_hours, beds, addr_city,
            changeset_id, changeset_version, changeset_timestamp,
            changeset_user, uuid, coordinates, completeness
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (osm_id) DO UPDATE SET
            osm_type = EXCLUDED.osm_type,
            amenity = EXCLUDED.amenity,
            healthcare = EXCLUDED.healthcare,
            name = EXCLUDED.name,
            operator_type = EXCLUDED.operator_type,
            operational_status = EXCLUDED.operational_status,
            opening_hours = EXCLUDED.opening_hours,
            beds = EXCLUDED.beds,
            addr_city = EXCLUDED.addr_city,
            changeset_id = EXCLUDED.changeset_id,
            changeset_version = EXCLUDED.changeset_version,
            changeset_timestamp = EXCLUDED.changeset_timestamp,
            changeset_user = EXCLUDED.changeset_user,
            uuid = EXCLUDED.uuid,
            coordinates = EXCLUDED.coordinates,
            completeness = EXCLUDED.completeness`

	stmt, err := tx.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %v", err)
	}
	defer stmt.Close()

	for _, site := range sites {
		coords, err := json.Marshal(site.Centroid.Coordinates)
		if err != nil {
			return fmt.Errorf("failed to marshal coordinates: %v", err)
		}

		_, err = stmt.Exec(
			site.OSMID,
			site.OSMType,
			site.Attributes.Amenity,
			site.Attributes.Healthcare,
			site.Attributes.Name,
			site.Attributes.OperatorType,
			site.Attributes.OperationalStatus,
			site.Attributes.OpeningHours,
			site.Attributes.Beds,
			site.Attributes.AddrCity,
			site.Attributes.ChangesetID,
			site.Attributes.ChangesetVersion,
			site.Attributes.ChangesetTimestamp,
			site.Attributes.ChangesetUser,
			site.Attributes.UUID,
			coords,
			site.Completeness,
		)
		if err != nil {
			return fmt.Errorf("failed to execute statement: %v", err)
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

func (s *DBStore) GetHealthSite() ([]HealthSite, error) {
	var sites []HealthSite

	query := `
        SELECT osm_id, osm_type, amenity, healthcare, name, operator_type,
               operational_status, opening_hours, beds, addr_city,
               changeset_id, changeset_version, changeset_timestamp,
               changeset_user, uuid, coordinates, completeness
        FROM healthsites`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var site HealthSite
		var coordsJSON []byte

		err := rows.Scan(
			&site.OSMID,
			&site.OSMType,
			&site.Attributes.Amenity,
			&site.Attributes.Healthcare,
			&site.Attributes.Name,
			&site.Attributes.OperatorType,
			&site.Attributes.OperationalStatus,
			&site.Attributes.OpeningHours,
			&site.Attributes.Beds,
			&site.Attributes.AddrCity,
			&site.Attributes.ChangesetID,
			&site.Attributes.ChangesetVersion,
			&site.Attributes.ChangesetTimestamp,
			&site.Attributes.ChangesetUser,
			&site.Attributes.UUID,
			&coordsJSON,
			&site.Completeness,
		)
		if err != nil {
			return nil, err
		}

		// Parse coordinates
		site.Centroid.Type = "Point"
		err = json.Unmarshal(coordsJSON, &site.Centroid.Coordinates)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal coordinates: %v", err)
		}

		sites = append(sites, site)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sites, nil
}

func (s *DBStore) Close() error {
	return s.db.Close()
}
