// debug_table.php
<?php
header("Content-Type: text/html; charset=UTF-8");
$conn = new mysqli('localhost', 'root', 'mypassword', 'eplms_business_permit_db');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>Table Structure: business_permit_applications</h2>";

// Get table structure
$result = $conn->query("DESCRIBE business_permit_applications");
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['Field'] . "</td>";
    echo "<td>" . $row['Type'] . "</td>";
    echo "<td>" . $row['Null'] . "</td>";
    echo "<td>" . $row['Key'] . "</td>";
    echo "<td>" . $row['Default'] . "</td>";
    echo "<td>" . $row['Extra'] . "</td>";
    echo "</tr>";
}
echo "</table>";

echo "<h2>Count: " . $result->num_rows . " columns</h2>";

// Also show CREATE TABLE statement
$result2 = $conn->query("SHOW CREATE TABLE business_permit_applications");
$row2 = $result2->fetch_assoc();
echo "<h2>CREATE TABLE Statement:</h2>";
echo "<pre>" . htmlspecialchars($row2['Create Table']) . "</pre>";

$conn->close();
?>