import React, { useState, useEffect } from 'react';

const Builder = () => {
  const [weapons, setWeapons] = useState([]);
  const [armors, setArmors] = useState({});
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedArmor, setSelectedArmor] = useState({
    helmet: null,
    chest: null,
    gauntlets: null,
    belt: null,
    boots: null,
    amulet: null,
  });
  const [savedSets, setSavedSets] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Estado para armazenar o índice do conjunto em edição awa

  useEffect(() => {
    // Carregar dados do JSON uwu
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        setWeapons(data.weapons);
        setArmors(data.armor);
      });

    const storedSets = localStorage.getItem('savedSets');
    if (storedSets) {
      setSavedSets(JSON.parse(storedSets));
    }
  }, []);

  const handleWeaponChange = (event) => {
    const weapon = weapons.find((w) => w.id === parseInt(event.target.value));
    setSelectedWeapon(weapon);
  };

  const handleArmorChange = (event, piece) => {
    const armor = armors[piece].find((a) => a.id === parseInt(event.target.value));
    setSelectedArmor((prevArmor) => ({
      ...prevArmor,
      [piece]: armor,
    }));
  };

  const calculateSkillsSummary = () => {
    const allArmors = Object.values(selectedArmor);
    const skills = allArmors.reduce((acc, armor) => {
      if (armor && armor.skills) {
        armor.skills.forEach((skill) => {
          if (acc[skill.name]) {
            acc[skill.name] += skill.level;
          } else {
            acc[skill.name] = skill.level;
          }
        });
      }
      return acc;
    }, {});
    return skills;
  };

  const handleSaveSet = () => {
    const title = prompt('Nome do conjunto:');
    if (title) {
      const newSet = {
        title,
        weapon: selectedWeapon,
        armor: selectedArmor,
      };
      let updatedSets = [];
      if (editIndex !== null) {
        updatedSets = [...savedSets];
        updatedSets[editIndex] = newSet;
        setEditIndex(null);
      } else {
        updatedSets = [...savedSets, newSet];
      }
      setSavedSets(updatedSets);
      localStorage.setItem('savedSets', JSON.stringify(updatedSets));
    }
  };

  const handleEditSet = (index) => {
    const setToEdit = savedSets[index];
    setSelectedWeapon(setToEdit.weapon);
    setSelectedArmor(setToEdit.armor);
    setEditIndex(index);
  };

  return (
    <div className="builder">
      <div className="selections">
        <h3>You selections</h3>
        <div>
          <h4>Weapon</h4>
          <select onChange={handleWeaponChange} value={selectedWeapon ? selectedWeapon.id : ''}>
            <option value="">Select your weapon</option>
            {weapons.map((weapon) => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.name}
              </option>
            ))}
          </select>
          {selectedWeapon && (
            <p>
              {selectedWeapon.name} - Ataque: {selectedWeapon.attack}
            </p>
          )}
        </div>
        <div>
          <h4>Make your gear set</h4>
          {Object.keys(armors).map((piece) => (
            <div key={piece}>
              <h5>{piece.charAt(0).toUpperCase() + piece.slice(1)}</h5>
              <select onChange={(e) => handleArmorChange(e, piece)} value={selectedArmor[piece] ? selectedArmor[piece].id : ''}>
                <option value="">Choose {piece}</option>
                {armors[piece].map((armor) => (
                  <option key={armor.id} value={armor.id}>
                    {armor.name}
                  </option>
                ))}
              </select>
              {selectedArmor[piece] && (
                <p>
                  {selectedArmor[piece].name} - Defesa: {selectedArmor[piece].defense}
                </p>
              )}
            </div>
          ))}
        </div>
        <div>
          <h4>Skills</h4>
          <ul>
            {Object.entries(calculateSkillsSummary()).map(([skill, level]) => (
              <li key={skill}>
                {skill}: Nível {level}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSaveSet}>{editIndex !== null ? 'Modificar Conjunto' : 'Save Gear Set'}</button>
      </div>
      <div className="saved-sets">
        <h4>Saved Sets</h4>
        {savedSets.map((set, index) => (
          <div key={index}>
            <h5>{set.title}</h5>
            <button onClick={() => setSelectedWeapon(set.weapon) || setSelectedArmor(set.armor)}>
              Load Gear set
            </button>
            <button onClick={() => handleEditSet(index)}>
              Modify Gear set
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Builder;
