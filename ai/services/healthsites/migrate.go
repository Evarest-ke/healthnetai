package healthsites

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func MigrateFromSQLiteToPostgres() error {
	// Connect to SQLite
	sqliteDB, err := sql.Open("sqlite3", "./backend/database/clinicStore.db")
	if err != nil {
		return fmt.Errorf("failed to connect to SQLite: %v", err)
	}
	defer sqliteDB.Close()

	// Connect to Postgres
	postgresStore, err := NewDBStore()
	if err != nil {
		return fmt.Errorf("failed to connect to Postgres: %v", err)
	}
	defer postgresStore.Close()

	// Query all data from SQLite
	query := `
        SELECT osm_id, osm_type, amenity, healthcare, name, operator_type,
               operational_status, opening_hours, beds, addr_city,
               changeset_id, changeset_version, changeset_timestamp,
               changeset_user, uuid, coordinates, completeness
        FROM healthsites`

	rows, err := sqliteDB.Query(query)
	if err != nil {
		return fmt.Errorf("failed to query SQLite: %v", err)
	}
	defer rows.Close()

	var sites []HealthSite
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
			return fmt.Errorf("failed to scan row: %v", err)
		}

		site.Centroid.Type = "Point"
		err = json.Unmarshal(coordsJSON, &site.Centroid.Coordinates)
		if err != nil {
			return fmt.Errorf("failed to unmarshal coordinates for site %s: %v", site.Attributes.Name, err)
		}

		sites = append(sites, site)
		log.Printf("Migrating site: %s", site.Attributes.Name)
	}

	if err = rows.Err(); err != nil {
		return fmt.Errorf("error iterating rows: %v", err)
	}

	// Insert all sites into Postgres
	if err := postgresStore.UpsertHealthSite(sites); err != nil {
		return fmt.Errorf("failed to insert into Postgres: %v", err)
	}

	log.Printf("Successfully migrated %d sites from SQLite to Postgres", len(sites))
	return nil
} 