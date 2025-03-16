import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import datetime
import os
class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'

        self.createTables(purge=purge)

    def query(self, query = "SELECT CURDATE()", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query, parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()
        cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row

    def about(self, nested=False):    
        query = """select concat(col.table_schema, '.', col.table_name) as 'table',
                          col.column_name                               as column_name,
                          col.column_key                                as is_key,
                          col.column_comment                            as column_comment,
                          kcu.referenced_column_name                    as fk_column_name,
                          kcu.referenced_table_name                     as fk_table_name
                    from information_schema.columns col
                    join information_schema.tables tab on col.table_schema = tab.table_schema and col.table_name = tab.table_name
                    left join information_schema.key_column_usage kcu on col.table_schema = kcu.table_schema
                                                                     and col.table_name = kcu.table_name
                                                                     and col.column_name = kcu.column_name
                                                                     and kcu.referenced_table_schema is not null
                    where col.table_schema not in('information_schema','sys', 'mysql', 'performance_schema')
                                              and tab.table_type = 'BASE TABLE'
                    order by col.table_schema, col.table_name, col.ordinal_position;"""
        results = self.query(query)
        if nested == False:
            return results

        table_info = {}
        for row in results:
            table_info[row['table']] = {} if table_info.get(row['table']) is None else table_info[row['table']]
            table_info[row['table']][row['column_name']] = {} if table_info.get(row['table']).get(row['column_name']) is None else table_info[row['table']][row['column_name']]
            table_info[row['table']][row['column_name']]['column_comment']     = row['column_comment']
            table_info[row['table']][row['column_name']]['fk_column_name']     = row['fk_column_name']
            table_info[row['table']][row['column_name']]['fk_table_name']      = row['fk_table_name']
            table_info[row['table']][row['column_name']]['is_key']             = row['is_key']
            table_info[row['table']][row['column_name']]['table']              = row['table']
        return table_info




    def createTables(self, purge=False, data_path='flask_app/database/'):
        table_order = ['institutions', 'positions', 'experiences', 'skills', 'feedback']

        if purge:
            # Drop tables in reverse order to handle dependencies correctly
            drop_queries = [
                "DROP TABLE IF EXISTS feedback",
                "DROP TABLE IF EXISTS skills",
                "DROP TABLE IF EXISTS experiences",
                "DROP TABLE IF EXISTS positions",
                "DROP TABLE IF EXISTS institutions"
            ]
            for drop_query in drop_queries:
                self.query(drop_query)

        for table in table_order:
            sql_file_path = os.path.join(data_path, 'create_tables', f'{table}.sql')

            # Create the table by executing the SQL script
            if os.path.exists(sql_file_path):
                with open(sql_file_path, 'r') as sql_file:
                    self.query(sql_file.read())

            # Check if table is already populated
            existing_row_count = self.query(f"SELECT COUNT(*) as count FROM {table}")
            if existing_row_count[0]['count'] == 0:
                csv_file_path = os.path.join(data_path, 'initial_data', f'{table}.csv')

                # If an initial data CSV exists, populate the table
                if os.path.exists(csv_file_path):
                    with open(csv_file_path, 'r') as csv_file:
                        csv_reader = csv.reader(csv_file)
                        headers = next(csv_reader)

                        # Exclude the first column if it's an ID
                        if headers[0].endswith('_id'):
                            headers = headers[1:]

                        rows = [[None if value in ('', 'NULL') else value for value in row[1:]] for row in csv_reader]

                        if rows:
                            self.insertRows(table=table, columns=headers, parameters=rows)


    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        # Generate the INSERT query
        columns_str = ", ".join(columns)
        placeholders = ", ".join(["%s"] * len(columns))
        insert_query = f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})"

        # Insert the rows
        for param in parameters:
            self.query(insert_query, param)


    def getResumeData(self):
        try:
            # Fetch all data in a single query per table
            institutions = self.query("SELECT * FROM institutions")
            positions = self.query("SELECT * FROM positions")
            experiences = self.query("SELECT * FROM experiences")
            skills = self.query("SELECT * FROM skills")

            # Dictionary to hold the structured resume data
            resume_data = {}

            # Populate institutions
            for institution in institutions:
                inst_id = institution['inst_id']
                resume_data[inst_id] = {
                    'name': institution['name'],
                    'department': institution.get('department', ''),
                    'address': institution.get('address', ''),
                    'city': institution.get('city', ''),
                    'state': institution.get('state', ''),
                    'zip': institution.get('zip', ''),
                    'type': institution.get('type', ''),
                    'positions': {}
                }

            # Populate positions under their respective institutions
            for position in positions:
                inst_id = position['inst_id']
                position_id = position['position_id']

                if inst_id in resume_data:
                    resume_data[inst_id]['positions'][position_id] = {
                        'title': position['title'],
                        'responsibilities': position['responsibilities'],
                        'start_date': position.get('start_date', ''),
                        'end_date': position.get('end_date', 'Present'),
                        'experiences': {}
                    }

            # Populate experiences under positions
            for experience in experiences:
                position_id = experience['position_id']
                experience_id = experience['experience_id']

                for inst_id, institution_data in resume_data.items():
                    if position_id in institution_data['positions']:
                        institution_data['positions'][position_id]['experiences'][experience_id] = {
                            'name': experience['name'],
                            'description': experience['description'],
                            'hyperlink': experience.get('hyperlink', ''),
                            'start_date': experience.get('start_date', ''),
                            'end_date': experience.get('end_date', 'Present'),
                            'skills': {}
                        }

            # Populate skills under experiences
            for skill in skills:
                experience_id = skill['experience_id']
                skill_id = skill['skill_id']

                for inst_id, institution_data in resume_data.items():
                    for position_id, position_data in institution_data['positions'].items():
                        if experience_id in position_data['experiences']:
                            position_data['experiences'][experience_id]['skills'][skill_id] = {
                                'name': skill['name'],
                                'skill_level': skill.get('skill_level', '')
                            }

            return resume_data  # Return structured data

        except Exception as e:
            print(f"Error fetching resume data: {e}")
            raise
