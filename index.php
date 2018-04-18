<!DOCTYPE html>
<html>
<head>
	<meta charset="utf8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="index.css">
	<script src="index.js"></script>
</head>
<body> 
<div id="myNav" class="overlay">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
  <div class="overlay-content">
     <form method="post" action="index.php">
                   Name: <input type="text" placeholder="Your Name" name="name">
                Note: <textarea type="text" placeholder="Add..." name="note"></textarea>
                    <input type="submit" name="SubmitButton">
                </form>
      
       <?php
      function insertData()
      {
       
            $conn = mysqli_connect("localhost", "rg425", "rg425", "rg425_test");

            if($conn === false){
                die("ERROR: Could not connect. " . mysqli_connect_error());
            }


           if(isset($_POST['name'], $_POST['note'])){

               $name = $_POST['name'];
               $note = $_POST['note'];       



            $sql =  "INSERT INTO assignmenttest (name, note)
                VALUES ('".$_POST["name"]."','".$_POST["note"]."')";

           }

               $result = mysqli_query($conn, $sql);
      
      }
      
       insertData();
       
      function retrieveData() {
          
       if(isset($_GET['name'])) {
           $sql = "SELECT * FROM assignmenttest WHERE name=".$_GET['name'];
       }
          
        
    ?>
    
    
      
  </div>
</div>

<h2>V and A Webpage</h2>
    <form id="send">
                <fieldset> <!--Puts the fieldset in for the search bar-->
                    <legend>Search the V & A</legend>
                        <input id="submitBox" type="text" name="submitBox" required />
                        <input id="submitButton" type="submit" />
                </fieldset>
            </form>
<span style="font-size:30px;cursor:pointer" onclick="openNav()">open</span>

    
     
        </body>
</html>
