  <?php
        class MyAPI
        {    
            private $rc = 500;
            private $data = null;
            private $db = null;
      
            
        public function _construct()
            
            {
                $this->data = array();
                $this->database = new mysqli("itsuite.it.brighton.ac.uk", "rg425", "rg425", "rg425_ass2");
            }
            
        public function _destruct()
        
            {
                $this->db->close();
            }
                
        public function handleRequest(){
                    
                    if($_SERVER['REQUEST_METHOD'] === 'GET') 
                        {
                            $this->getItem(); // return item
                        }
            else if($_SERVER['REQUEST_METHOD'] === 'POST') {
                            $this->postItem(); // create item
                                                            }
                        else    {
                            $this->rc = 400; // bad request
                                }
            
            http_response_code($this->rc); // set status code
                        
            if($this->rc == 200) {
            header('content-type: application/json'); // set header
            echo json_encode($this->data); // serve data 
                        }
                }
            
        private function retrieveData() {
          
            if(isset($_GET['oid'])) {
                $sql = "SELECT * FROM ass2table WHERE oid=".$_GET['oid'];
            }
        
                $result = mysqli_query('SELECT * FROM ass2table');
            while ($row = mysqli_fetch_array($result)) {
                echo $row['name'];
                echo $row['notes'];
            }
              
        retrieveData();
          

        private function insertData()
           if(isset($_POST['submit'])){

               $name = $_POST['name'];
               $notes = $_POST['notes'];       



            $sql =  "INSERT INTO ass2table (name, notes)
                VALUES ('".$_POST["name"]."','".$_POST["notes"]."')";

           }

               $result = mysqli_query($conn, $sql);
      
        }
      
      insertData();
                

    }
       
                $api = new MyAPI();
                $api->handleRequest();
        
    ?>